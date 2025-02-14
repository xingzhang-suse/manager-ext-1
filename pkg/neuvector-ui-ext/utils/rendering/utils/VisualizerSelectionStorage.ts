import type { NodeId } from "../../../generated/CoreApiDtos";

export interface VisualizerSelection {
  elementId: NodeId | undefined;
  groupId: NodeId | undefined;
  indirectRelationId: NodeId | undefined;
  groupRelationId: NodeId | undefined;
}

const DEFAULT_SELECTION: VisualizerSelection = {
  elementId: undefined,
  groupId: undefined,
  indirectRelationId: undefined,
  groupRelationId: undefined,
};

export class VisualizerSelectionStorage {
  private selection = DEFAULT_SELECTION;

  public setSelection(selection: VisualizerSelection): void {
    this.selection = selection;
  }

  public getSelection(): VisualizerSelection {
    return this.selection;
  }

  public clearSelection(): void {
    this.selection = DEFAULT_SELECTION;
  }
}
