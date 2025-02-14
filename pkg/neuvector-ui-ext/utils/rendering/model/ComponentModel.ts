import { Box3, Vector3 } from "three";

import { HealthStateValue, type NodeId, type ViewComponent } from "../../../common/CoreApi";
import { StackVizConfig } from "../StackVizConfig";
import type { InteractionObject } from "../world/InteractionMesh";

const dx = 1;
const ANCHOR_POINTS: Array<Vector3> = [
  // basic points, top right left bottom centers
  new Vector3(0, StackVizConfig.COMPONENT_HEIGHT / 2, 0),
  new Vector3(StackVizConfig.COMPONENT_WIDTH / 2, 0, 0),
  new Vector3(0, -StackVizConfig.COMPONENT_HEIGHT / 2, 0),
  new Vector3(-StackVizConfig.COMPONENT_WIDTH / 2, 0, 0),
  // some additional points
  new Vector3(-dx, StackVizConfig.COMPONENT_HEIGHT / 2, 0),
  new Vector3(dx, StackVizConfig.COMPONENT_HEIGHT / 2, 0),

  new Vector3(StackVizConfig.COMPONENT_WIDTH / 2, dx, 0),
  new Vector3(StackVizConfig.COMPONENT_WIDTH / 2, -dx, 0),

  new Vector3(-dx, -StackVizConfig.COMPONENT_HEIGHT / 2, 0),
  new Vector3(dx, -StackVizConfig.COMPONENT_HEIGHT / 2, 0),

  new Vector3(-StackVizConfig.COMPONENT_WIDTH / 2, dx, 0),
  new Vector3(-StackVizConfig.COMPONENT_WIDTH / 2, -dx, 0),
];

const ANCHOR_POINTS_SPOTLIGHTED: Array<Vector3> = [
  // basic points, top right left bottom centers
  new Vector3(0, StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),
  new Vector3(StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, 0, 0),
  new Vector3(0, -StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),
  new Vector3(-StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, 0, 0),
  // some additional points
  new Vector3(-dx, StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),
  new Vector3(dx, StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),

  new Vector3(StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, dx, 0),
  new Vector3(StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, -dx, 0),

  new Vector3(-dx, -StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),
  new Vector3(dx, -StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED / 2, 0),

  new Vector3(-StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, dx, 0),
  new Vector3(-StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED / 2, -dx, 0),
];

const CENTER = new Vector3();
const SIZE = new Vector3(StackVizConfig.COMPONENT_WIDTH, StackVizConfig.COMPONENT_HEIGHT);
const SIZE_SPOTLIGHTED = new Vector3(
  StackVizConfig.COMPONENT_WIDTH_SPOTLIGHTED,
  StackVizConfig.COMPONENT_HEIGHT_SPOTLIGHTED,
);

const HIDDEN_CONNECTIONS_POSITION = new Vector3(-2, -2, 1);
const HIDDEN_CONNECTIONS_SIZE = new Vector3(1.5, 1.5);

/**
 * Transitive model of ViewComponent to handle and store some data before it is going to be actually rendered
 *
 * contains some shortcuts for ViewComponent data, also stores some information related to the rendering
 */
export class ComponentModel {
  public position: Vector3 = new Vector3(); // position of ViewComponent in the World space
  public readonly component: ViewComponent;
  public peers: Array<InteractionObject> = []; // peers to highlight
  public neighboursNotInQuery: number;

  constructor(component: ViewComponent, neighboursNotInQuery: number) {
    this.component = component;
    this.neighboursNotInQuery = neighboursNotInQuery;
  }

  public destroy(): void {
    this.peers = [];
  }

  public getNode(): ViewComponent {
    return this.component;
  }

  public getNodeId(): NodeId {
    return this.component.id!;
  }

  public getHealthState(): HealthStateValue {
    return this.component.state?.healthState ?? HealthStateValue.Uninitialized;
  }

  public getComponentType(): NodeId {
    return this.component.type;
  }

  public getNameSpriteText(): string {
    return this.component.name;
  }

  public hasIdentifier(identifier: string | undefined): boolean {
    return identifier != null && this.component.identifiers != null && this.component.identifiers.includes(identifier);
  }

  // ---- for rendering -----
  // ------------------------
  public getAnchorPoints(isSpotlightedComponent = false): Array<Vector3> {
    return isSpotlightedComponent ? ANCHOR_POINTS_SPOTLIGHTED : ANCHOR_POINTS;
  }

  public getHighestPoint(isSpotlightedComponent = false): Vector3 {
    return this.getAnchorPoints(isSpotlightedComponent)[0]; // top anchor point
  }

  // the bounding box to determine the sizes of ViewComponent in the World
  public getBoundingBox(isSpotlightedComponent = false): Box3 {
    return isSpotlightedComponent
      ? new Box3().setFromCenterAndSize(CENTER, SIZE_SPOTLIGHTED)
      : new Box3().setFromCenterAndSize(CENTER, SIZE);
  }

  public getHiddenConnectionsBox(): Box3 {
    return new Box3().setFromCenterAndSize(HIDDEN_CONNECTIONS_POSITION, HIDDEN_CONNECTIONS_SIZE);
  }
}
