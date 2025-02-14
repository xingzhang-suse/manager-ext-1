import {
  Box3,
  Group,
  Mesh,
  type Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  type Texture,
  TextureLoader,
  Vector3,
} from "three";

import { selectComponentTypesValues } from "../../../app/state/global/GlobalMiscSelectors";
import { type ComponentType, type NodeId, ViewElementRetrievalSource } from "../../../common/CoreApi";
import { getNumberOfFailingChecks, healthStateToColorForViz, isHealthStateUnHealthy } from "../../../common/functions";
import { getHealthStateMaterial } from "../common/HealthStateMaterial";
import StackVizTextureFragmentShader from "../common/shaders/StackVizTextureFragmentShader.glsl?raw";
import StackVizTextureVertexShader from "../common/shaders/StackVizTextureVertexShader.glsl?raw";
import { LOD_LEVEL_HIGH, type LodLevel } from "../LodLevel";
import type { ComponentModel } from "../model/ComponentModel";
import { StackVizConfig } from "../StackVizConfig";
import type { StackVizContext } from "../StackVizContext";
import { Text3D } from "../text/Text3D";
import { cleanupResources } from "../utils/Util3d";

import { COMPONENT_GEOMETRY } from "./elements/ComponentShape";
import hiddenConnections from "./elements/hidden-connections.svg";
import hoverHiddenConnectionsWide1 from "./elements/hover-hidden-connections-wide-1.svg";
import hoverHiddenConnectionsWide2 from "./elements/hover-hidden-connections-wide-2.svg";
import hoverHiddenConnectionsWide3 from "./elements/hover-hidden-connections-wide-3.svg";
import type { HealthStateBadgeMetaData } from "./HealthStateBadges";
import { renderHealthStateBadges } from "./HealthStateBadges";

const COLLAPSED_NAME_SPRITE_HEIGHT = StackVizConfig.COMPONENT_HEIGHT / 2.5;
const COLLAPSED_NAME_SPRITE_WIDTH = StackVizConfig.COMPONENT_WIDTH * 2.2;
const COLLAPSED_NAME_SPRITE_LINES = 2;
const DISTANCE_TO_THE_NAME =
  (COLLAPSED_NAME_SPRITE_HEIGHT * COLLAPSED_NAME_SPRITE_LINES) / 2 + StackVizConfig.COMPONENT_TEXT_DISTANCE;

// ----- hidden connections --- //
const HIDDEN_CONNECTIONS_INITIAL_SCALE = 1.5;
const HIDDEN_CONNECTIONS_HOVER_SCALE = 1.7;

const HIDDEN_CONNECTIONS_POSITION_X = -1.6;
const HIDDEN_CONNECTIONS_POSITION_Y = -1.6;
const HIDDEN_CONNECTIONS_HOVER_ICON_Y_SCALE = 18;
const textureLoader = new TextureLoader();

const hiddenConnectionTexture = textureLoader.load(hiddenConnections);
hiddenConnectionTexture.colorSpace = SRGBColorSpace;
const hiddenConnectionsMaterial = new SpriteMaterial({ map: hiddenConnectionTexture, transparent: true });
const hiddenConnectionsIcon = new Sprite(hiddenConnectionsMaterial);
hiddenConnectionsIcon.scale.set(HIDDEN_CONNECTIONS_INITIAL_SCALE, HIDDEN_CONNECTIONS_INITIAL_SCALE, 1);

//size 1
const hoverHiddenConnectionsWideTexture1 = textureLoader.load(hoverHiddenConnectionsWide1);
hoverHiddenConnectionsWideTexture1.colorSpace = SRGBColorSpace;
const hoverHiddenConnectionsWideMaterial1 = new SpriteMaterial({
  map: hoverHiddenConnectionsWideTexture1,
  transparent: true,
});
const hoverHiddenConnectionsWideIcon1 = new Sprite(hoverHiddenConnectionsWideMaterial1);
hoverHiddenConnectionsWideIcon1.scale.set(
  (34 / 18) * HIDDEN_CONNECTIONS_HOVER_SCALE,
  HIDDEN_CONNECTIONS_HOVER_SCALE,
  1,
);

// size 2
const hoverHiddenConnectionsWideTexture2 = textureLoader.load(hoverHiddenConnectionsWide2);
hoverHiddenConnectionsWideTexture2.colorSpace = SRGBColorSpace;
const hoverHiddenConnectionsWideMaterial2 = new SpriteMaterial({
  map: hoverHiddenConnectionsWideTexture2,
  transparent: true,
});
const hoverHiddenConnectionsWideIcon2 = new Sprite(hoverHiddenConnectionsWideMaterial2);
hoverHiddenConnectionsWideIcon2.scale.set(
  (39 / HIDDEN_CONNECTIONS_HOVER_ICON_Y_SCALE) * HIDDEN_CONNECTIONS_HOVER_SCALE,
  HIDDEN_CONNECTIONS_HOVER_SCALE,
  1,
);

//size 3
const hoverHiddenConnectionsWideTexture3 = textureLoader.load(hoverHiddenConnectionsWide3);
hoverHiddenConnectionsWideTexture3.colorSpace = SRGBColorSpace;
const hoverHiddenConnectionsWideMaterial3 = new SpriteMaterial({
  map: hoverHiddenConnectionsWideTexture3,
  transparent: true,
});
const hoverHiddenConnectionsWideIcon3 = new Sprite(hoverHiddenConnectionsWideMaterial3);
hoverHiddenConnectionsWideIcon3.scale.set(
  (44 / HIDDEN_CONNECTIONS_HOVER_ICON_Y_SCALE) * HIDDEN_CONNECTIONS_HOVER_SCALE,
  HIDDEN_CONNECTIONS_HOVER_SCALE,
  1,
);

// We provide the hidden connections hover icon in various sizes, depending on the amount of text that needs to fit.
const hoverHiddenConnectionsIconsSizes: Array<Sprite> = [
  hoverHiddenConnectionsWideIcon1,
  hoverHiddenConnectionsWideIcon2,
  hoverHiddenConnectionsWideIcon3,
];

// ----- hidden connections end --- //

/**
 * This class is responsible to render all of the components
 */
export class Components3D {
  private readonly stackVizContext: StackVizContext;
  private readonly components: Map<NodeId, ComponentModel>;
  private readonly hiddenCountsForComponents = new Map<NodeId, number>();
  private readonly mesh = new Group();

  private readonly labels = new Group();
  private readonly icons = new Group();
  private readonly bodies = new Group();
  private readonly badges = new Group();

  private readonly hiddenConnections = new Group();
  private readonly hiddenConnectionsIconMap = new Map<NodeId, Object3D>();
  private readonly hiddenConnectionsCountTextMap = new Map<NodeId, Object3D>();
  private lastHoveredExtra: NodeId | undefined;

  // lookup map for component types
  private readonly componentTypes: Map<NodeId, ComponentType>;

  constructor(stackVizContext: StackVizContext, components: Map<NodeId, ComponentModel>) {
    // setup
    this.stackVizContext = stackVizContext;
    this.components = components;

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
    this.hiddenConnections.children.forEach((child) => {
      // dispose texture
      (child as Sprite).material.map?.dispose();
      // dispose material
      (child as Sprite).material.dispose();
    });
    // clear 3d
    this.icons.children.forEach((child) => {
      // dispose texture
      (child as Sprite).material.map?.dispose();
      // dispose material
      (child as Sprite).material.dispose();
    });
  }

  /**
   * The part in the world that user can interact with (for example, hoever or select)
   */
  public getIntersections(): Array<Object3D> {
    return this.bodies.children;
  }

  private render(): void {
    const hasSpotlightedComponent = this.stackVizContext.spotlightedComponentIdentifier != null;

    // render all parts of components
    this.components.forEach((component) => {
      const isSpotlightedComponent = component.hasIdentifier(this.stackVizContext.spotlightedComponentIdentifier);
      const hasOpacity =
        (hasSpotlightedComponent && !isSpotlightedComponent) ||
        component.component.retrievalSource == ViewElementRetrievalSource.VisualizerSettings;

      // add fade out effect and increase the component size when the spotlightedComponentIdentifier property is defined
      this.renderBody(component, isSpotlightedComponent, hasOpacity);
      this.renderLabel(component, isSpotlightedComponent, hasOpacity);
      this.renderIcon(component, isSpotlightedComponent, hasOpacity);
    });

    this.renderBadges();

    // add to scene
    this.icons.position.setZ(0.1);
    this.hiddenConnections.position.setZ(0.1);
    this.badges.position.setZ(0.2);
    this.mesh.position.setZ(StackVizConfig.CI_DEPTH);
    this.mesh.add(this.bodies, this.labels, this.icons, this.hiddenConnections, this.badges);
    this.stackVizContext.world.getThreeScene().add(this.mesh);
  }

  private renderBadges(): void {
    const badges: Array<HealthStateBadgeMetaData> = [...this.components.values()]
      .filter((component) => isHealthStateUnHealthy(component.getHealthState()))
      .map((component) => {
        const isSpotlightedComponent = component.hasIdentifier(this.stackVizContext.spotlightedComponentIdentifier);
        const zoomLevel = isSpotlightedComponent ? StackVizConfig.ZOOM_LEVEL : 1;
        const hasOpacity =
          (this.stackVizContext.spotlightedComponentIdentifier != null && !isSpotlightedComponent) ||
          component.component.retrievalSource == ViewElementRetrievalSource.VisualizerSettings;

        const failedChecks = getNumberOfFailingChecks(component.getNode());
        return {
          position: component.position
            .clone()
            .add(
              new Vector3(
                StackVizConfig.COMPONENT_BADGE_POSITION_X * zoomLevel,
                StackVizConfig.COMPONENT_BADGE_POSITION_Y * zoomLevel,
                0,
              ),
            ),
          label: failedChecks > 9 ? "9+" : `${failedChecks === 0 ? "" : failedChecks}`,
          state: component.getHealthState(),
          zoomLevel: zoomLevel,
          hasOpacity,
        };
      });
    this.badges.add(renderHealthStateBadges(badges));
  }

  private renderLabel(component: ComponentModel, isSpotlightedComponent: boolean, hasOpacity: boolean): void {
    const zoomLevel = isSpotlightedComponent ? StackVizConfig.ZOOM_LEVEL : 1;

    const text = new Text3D(component.getNameSpriteText(), {
      givenHeight: COLLAPSED_NAME_SPRITE_HEIGHT * zoomLevel,
      maxWidthScale: COLLAPSED_NAME_SPRITE_WIDTH * zoomLevel,
      maxTextLines: COLLAPSED_NAME_SPRITE_LINES,
      font: StackVizConfig.FONT,
      hasOpacity,
    });

    const dl = text.numberOfTextLines() / COLLAPSED_NAME_SPRITE_LINES;
    const height = text.numberOfTextLines() * COLLAPSED_NAME_SPRITE_HEIGHT * zoomLevel;
    const alignedText = dl * height - height; // align items to the bottom if they have the different number of lines
    const y = component.getHighestPoint(isSpotlightedComponent).y + alignedText + DISTANCE_TO_THE_NAME * zoomLevel;

    text.position.set(0, y, StackVizConfig.CI_DEPTH).add(component.position);
    this.labels.add(text);
  }

  private renderBody(component: ComponentModel, isSpotlightedComponent: boolean, hasOpacity: boolean): void {
    const componentGeometry = COMPONENT_GEOMETRY;
    const body = new Mesh(
      componentGeometry,
      getHealthStateMaterial({
        healthStateColor: healthStateToColorForViz(component.getHealthState()),
        hasOpacity,
      }),
    );
    if (isSpotlightedComponent) {
      body.scale.set(StackVizConfig.ZOOM_LEVEL, StackVizConfig.ZOOM_LEVEL, 1);
    }
    body.position.copy(component.position);
    body.userData.component = component;
    this.bodies.add(body);
  }

  private getIcon(component: ComponentModel): string | undefined {
    return component.getNode().iconbase64 || this.componentTypes.get(component.getComponentType())?.iconbase64;
  }

  private renderIcon(component: ComponentModel, isSpotlightedComponent: boolean, hasOpacity: boolean): void {
    const icon = this.getIcon(component);
    if (icon) {
      // TODOs potential memory leak, the execution might continue after the visualiser is destroyed
      void this.stackVizContext.iconTextureCache.load(icon).then((texture: Texture) => {
        texture.colorSpace = SRGBColorSpace;
        const shaderMaterial = new ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            brightness: { value: hasOpacity ? StackVizConfig.TEXTURE_FADE : 1 },
          },
          vertexShader: StackVizTextureVertexShader,
          fragmentShader: StackVizTextureFragmentShader,
          transparent: true,
        });
        const geometry = new PlaneGeometry(1, 1);
        const icon3D = new Mesh(geometry, shaderMaterial);

        icon3D.scale.multiplyScalar(
          isSpotlightedComponent
            ? StackVizConfig.COMPONENT_ICON_SIZE * StackVizConfig.ZOOM_LEVEL
            : StackVizConfig.COMPONENT_ICON_SIZE,
        );
        icon3D.position.add(component.position);
        this.icons.add(icon3D);
      });
    }
  }

  // ----- hidden connections ---- //
  // TODOs use a Mesh(with geometry and material) instead of a Sprite to display a hidden connections icon
  // and move it as a separate Entity out of Components3D
  public renderHiddenConnection(hiddenRelationCount: number, component: ComponentModel): void {
    const icon = hiddenConnectionsIcon.clone();
    icon.position.set(HIDDEN_CONNECTIONS_POSITION_X, HIDDEN_CONNECTIONS_POSITION_Y, 1).add(component.position);
    icon.userData.component = component;
    this.hiddenConnectionsIconMap.set(component.getNodeId(), icon);
    this.hiddenConnections.add(icon);
    this.hiddenCountsForComponents.set(component.getNodeId(), hiddenRelationCount);
  }

  public clearHiddenConnectionCounts(): void {
    this.hiddenCountsForComponents.clear();
  }

  public getHiddenConnectionPerNode(nodeId: NodeId): number | undefined {
    return this.hiddenCountsForComponents.get(nodeId);
  }

  private renderHoveredHiddenConnection(component: ComponentModel):
    | undefined
    | {
        hiddenRelationsBox: Box3;
      } {
    // Prepare the text
    const hiddenCount = this.hiddenCountsForComponents.get(component.getNodeId());

    if (hiddenCount === undefined || hiddenCount === 0) return;

    const hiddenRelationCountText = hiddenCount > 99 ? "99+" : `${hiddenCount}`;

    // ===== Place the icon
    const icon = hoverHiddenConnectionsIconsSizes[hiddenRelationCountText.length - 1].clone();

    // We make sure the+ stays in the middle. First transform to the left, assuming no scale
    const hooverLeftX = HIDDEN_CONNECTIONS_POSITION_X - HIDDEN_CONNECTIONS_HOVER_SCALE / 2;
    // Then account for the scaling of this particular hoover icon.
    const iconPosX = hooverLeftX + icon.scale.x / 2;

    icon.position.set(iconPosX, HIDDEN_CONNECTIONS_POSITION_Y, 1).add(component.position);
    icon.userData.component = component;
    this.hiddenConnectionsIconMap.set(component.getNodeId(), icon);
    this.hiddenConnections.add(icon);

    // ============= Place the text
    const text = new Text3D(hiddenRelationCountText, {
      givenHeight: StackVizConfig.BADGE_LABEL_HEIGHT,
      maxWidthScale: StackVizConfig.BADGE_LABEL_WIDTH,
      maxTextLines: 1,
      color: StackVizConfig.FONT_HOVER_COLOR,
    });

    // Text is placed to the right of the hover icon
    const badgeRightX = HIDDEN_CONNECTIONS_POSITION_X + HIDDEN_CONNECTIONS_INITIAL_SCALE / 2;
    const textPosX = badgeRightX + text.scale.x / 2;

    // Z value 1.1 to have the text on top of the icon
    text.position.set(textPosX, -1.7, 1.1).add(component.position);
    this.hiddenConnections.add(text);
    this.hiddenConnectionsCountTextMap.set(component.getNodeId(), text);

    return {
      hiddenRelationsBox: new Box3().setFromObject(icon),
    };
  }

  public hoverExtra(component: ComponentModel):
    | undefined
    | {
        hiddenRelationsBox: Box3;
      } {
    this.unHoverExtra();
    this.lastHoveredExtra = component.getNodeId();
    return this.renderHoveredHiddenConnection(component);
  }

  public unHoverExtra(): void {
    if (this.lastHoveredExtra) {
      const icon = this.hiddenConnectionsIconMap.get(this.lastHoveredExtra);
      if (icon) {
        this.hiddenConnections.remove(icon);
        this.hiddenConnectionsIconMap.delete(this.lastHoveredExtra);
      }
      const text = this.hiddenConnectionsCountTextMap.get(this.lastHoveredExtra);
      if (text) {
        this.hiddenConnections.remove(text);
        this.hiddenConnectionsCountTextMap.delete(this.lastHoveredExtra);
      }
    }
    this.lastHoveredExtra = undefined;
  }

  /**
   * The part in the world that user can interact with (for example, hoever or select)
   */
  public getHiddenConnectionsIntersections(): Array<Object3D> {
    return this.hiddenConnections.children;
  }

  // ----- end hidden connections ---- //

  public lodUpdate(lod: LodLevel): void {
    this.labels.visible = lod === LOD_LEVEL_HIGH;
    this.hiddenConnections.visible = lod === LOD_LEVEL_HIGH;
  }
}
