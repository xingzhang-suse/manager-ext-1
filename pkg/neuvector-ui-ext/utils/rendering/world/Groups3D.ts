import { BoxGeometry, Group, Mesh, type Object3D, ShaderMaterial, type Sprite, type Texture, Vector3 } from "three";

import { selectComponentTypesValues } from "../../../app/state/global/GlobalMiscSelectors";
import type { ComponentType, NodeId } from "../../../common/CoreApi";
import { ViewElementRetrievalSource } from "../../../common/CoreApi";
import { getNumberOfFailingChecks, healthStateToColorForViz, isHealthStateUnHealthy } from "../../../common/functions";
import { getHealthStateMaterial } from "../common/HealthStateMaterial";
import StackVizTextureFragmentShader from "../common/shaders/StackVizTextureFragmentShader.glsl?raw";
import StackVizTextureVertexShader from "../common/shaders/StackVizTextureVertexShader.glsl?raw";
import { LOD_LEVEL_HIGH, type LodLevel } from "../LodLevel";
import type { GroupModel } from "../model/GroupModel";
import { StackVizConfig } from "../StackVizConfig";
import type { StackVizContext } from "../StackVizContext";
import { Text3D } from "../text/Text3D";
import { cleanupResources } from "../utils/Util3d";

import { GROUP_GEOMETRY } from "./elements/GroupShape";
import { type HealthStateBadgeMetaData, renderHealthStateBadges } from "./HealthStateBadges";

const COLLAPSED_NAME_SPRITE_HEIGHT = StackVizConfig.COMPONENT_HEIGHT / 2.5;
const COLLAPSED_NAME_SPRITE_WIDTH = StackVizConfig.COMPONENT_WIDTH * 2.2;
const COLLAPSED_NAME_SPRITE_LINES = 2;
const DISTANCE_TO_THE_NAME =
  (COLLAPSED_NAME_SPRITE_HEIGHT * COLLAPSED_NAME_SPRITE_LINES) / 2 + StackVizConfig.COMPONENT_TEXT_DISTANCE;

/**
 * This class is responsible to render all of the TypeGroups
 */
export class Groups3D {
  private readonly stackVizContext: StackVizContext;
  private readonly groups: Map<NodeId, GroupModel>;
  private readonly mesh = new Group();
  private readonly labels = new Group();
  private readonly icons = new Group();
  private readonly bodies = new Group();
  private readonly badges = new Group();

  // lookup map for component types
  private readonly componentTypes: Map<NodeId, ComponentType>;

  constructor(stackVizContext: StackVizContext, groups: Map<NodeId, GroupModel>) {
    // setup
    this.groups = groups;
    this.stackVizContext = stackVizContext;

    this.componentTypes = new Map(
      selectComponentTypesValues(this.stackVizContext.store.getState()).map((componentType) => [
        componentType.id!,
        componentType,
      ]),
    );
    // render/add to scene
    this.render();
  }

  public destroy(): void {
    cleanupResources(this.mesh);
    this.icons.children.forEach((child) => {
      // dispose texture
      (child as Sprite).material.map?.dispose();
      // dispose material
      (child as Sprite).material.dispose();
    });
    this.groups.clear();
  }

  /**
   * The part in the world that user can interact with (for example, hoever or select)
   */
  public getIntersections(): Array<Object3D> {
    return this.bodies.children;
  }

  private render(): void {
    // render all parts of groups
    this.groups.forEach((group) => {
      const hasOpacity = group.group.classifier.retrievalSource == ViewElementRetrievalSource.VisualizerSettings;

      this.renderBody(group, hasOpacity);
      this.renderLabel(group, hasOpacity);
      this.renderIcon(group, hasOpacity);
    });

    this.renderBadges();

    // add to scene
    this.icons.position.setZ(0.1);
    this.badges.position.setZ(0.2);
    this.mesh.position.setZ(StackVizConfig.CI_DEPTH);
    this.mesh.add(this.bodies, this.labels, this.icons, this.badges);
    this.stackVizContext.world.getThreeScene().add(this.mesh);
  }

  private renderBadges(): void {
    const zAxis = new Vector3(0, 0, 1);
    const badges: Array<HealthStateBadgeMetaData> = [...this.groups.values()]
      .filter((group) => isHealthStateUnHealthy(group.getHealthState()))
      .map((group) => {
        const hasOpacity = group.group.classifier.retrievalSource == ViewElementRetrievalSource.VisualizerSettings;
        const radius = group.getGroupScale().x + StackVizConfig.GROUP_BADGE_POSITION;
        const relativePosition = new Vector3(radius, 0, 0).applyAxisAngle(
          zAxis,
          StackVizConfig.GROUP_BADGE_POSITION_ANGLE,
        );

        return {
          position: group.position.clone().add(relativePosition),
          label: this.getHealthStateBadgesLabel(group),
          state: group.getHealthState(),
          hasOpacity: hasOpacity,
        };
      });

    this.badges.add(renderHealthStateBadges(badges));
  }

  private renderLabel(group: GroupModel, hasOpacity: boolean): void {
    const text = new Text3D(this.getGroupName(group), {
      givenHeight: COLLAPSED_NAME_SPRITE_HEIGHT,
      maxWidthScale: COLLAPSED_NAME_SPRITE_WIDTH,
      maxTextLines: COLLAPSED_NAME_SPRITE_LINES,
      hasOpacity: hasOpacity,
    });

    const dl = text.numberOfTextLines() / COLLAPSED_NAME_SPRITE_LINES;
    const height = text.numberOfTextLines() * COLLAPSED_NAME_SPRITE_HEIGHT;
    const alignedText = dl * height - height; // align items to the bottom if they have the different number of lines
    const y = group.getGroupScale().y + alignedText + DISTANCE_TO_THE_NAME;

    text.position.set(0, y, StackVizConfig.CI_DEPTH).add(group.position);
    this.labels.add(text);
  }

  private getGroupName(group: GroupModel) {
    const name = this.componentTypes.get(group.getComponentType())?.name || "Unknown";
    const groupSize = group.getGroupSize();
    return `${name} group (${groupSize > 999 ? "999+" : groupSize})`;
  }

  private getIcon(group: GroupModel): string | undefined {
    return this.componentTypes.get(group.getComponentType())?.iconbase64;
  }

  private renderIcon(group: GroupModel, hasOpacity: boolean): void {
    const icon = this.getIcon(group);
    if (icon) {
      // TODOs potential memory leak, the execution might continue after the visualiser is destroyed
      void this.stackVizContext.iconTextureCache.load(icon).then((texture: Texture) => {
        const shaderMaterial = new ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            brightness: { value: hasOpacity ? StackVizConfig.TEXTURE_FADE : 1 },
          },
          vertexShader: StackVizTextureVertexShader,
          fragmentShader: StackVizTextureFragmentShader,
          transparent: true,
        });
        const geometry = new BoxGeometry(1, 1, 1);
        const icon3D = new Mesh(geometry, shaderMaterial);
        icon3D.scale.multiplyScalar(group.getGroupScale().x * 2 * StackVizConfig.GROUP_ICON_RATIO);
        icon3D.position.add(group.position);
        this.icons.add(icon3D);
      });
    }
  }

  private renderBody(group: GroupModel, hasOpacity: boolean): void {
    const body = new Mesh(
      GROUP_GEOMETRY,
      getHealthStateMaterial({
        healthStateColor: healthStateToColorForViz(group.getHealthState()),
        hasOpacity: hasOpacity,
      }),
    );
    body.scale.set(
      StackVizConfig.GROUP_SIZE_RADIUS * group.groupSizeScale,
      StackVizConfig.GROUP_SIZE_RADIUS * group.groupSizeScale,
      1,
    );
    body.position.add(group.position);
    body.userData.group = group;
    this.bodies.add(body);
  }

  /**
   * Might be performance heavy to calculate all the failing checks in the group, so we stop at the number 9 here
   * @param group
   * @private
   */
  private getHealthStateBadgesLabel(group: GroupModel): string {
    const componentIds = group.group.components;
    let failedChecks = 0;
    for (let i = 0; i < componentIds.length; i++) {
      const component = this.stackVizContext.stackViewSnapshot?.componentsLookUpMap.get(componentIds[i]);
      if (component) {
        failedChecks += getNumberOfFailingChecks(component);
        // look only for first 9 failed checks, no need to loop through all of them
        if (failedChecks > 9) {
          break;
        }
      }
    }

    return failedChecks > 9 ? "9+" : `${failedChecks === 0 ? "" : failedChecks}`;
  }

  public lodUpdate(lod: LodLevel): void {
    this.labels.visible = lod === LOD_LEVEL_HIGH;
  }
}
