import { DependencyDirection, HealthStateValue, type NodeId } from "../../../common/CoreApi";
import {
  createGroupRelation,
  createIndirectRelation,
  createRelation,
} from "../../../stackviz/demo/RandomStackViewGeneration";
import type { AllRelationTypes } from "../../../stackviz/rendering/RenderInput";
import { GrowOnlyRelationSet } from "../../../stackviz/StackViewToStackVizRenderInput";

describe("GrowOnlyRelationSet", () => {
  it("should be able to all relation types independently", () => {
    const viewRelation = createRelation(1, 1, 2, HealthStateValue.Clear);
    const indirectRelation = createIndirectRelation(3, 4);
    const groupRelation = createGroupRelation(5 as NodeId, 6 as NodeId);

    const relations = new GrowOnlyRelationSet();
    const input = [viewRelation, indirectRelation, groupRelation];
    relations.addRelations(input);

    const result: Array<AllRelationTypes> = [];
    relations.forEach((relation) => result.push(relation));

    expect(relations.count()).toBe(3);
    expect(result).toEqual(input);
  });

  it("should add relation only once and ignore subsequent additions", () => {
    const viewRelation1 = createRelation(1, 1, 2, HealthStateValue.Clear, DependencyDirection.OneWay);
    const indirectRelation1 = createIndirectRelation(3, 4, DependencyDirection.OneWay);
    const groupRelation1 = createGroupRelation(5 as NodeId, 6 as NodeId, DependencyDirection.OneWay);

    const viewRelation2 = createRelation(1, 1, 2, HealthStateValue.Clear, DependencyDirection.Both);
    const indirectRelation2 = createIndirectRelation(3, 4, DependencyDirection.Both);
    const groupRelation2 = createGroupRelation(5 as NodeId, 6 as NodeId, DependencyDirection.Both);

    const relations = new GrowOnlyRelationSet();
    const input1 = [viewRelation1, indirectRelation1, groupRelation1];
    const input2 = [viewRelation2, indirectRelation2, groupRelation2];
    relations.addRelations(input1);
    relations.addRelations(input2);

    const result: Array<AllRelationTypes> = [];
    relations.forEach((relation) => result.push(relation));

    expect(relations.count()).toBe(3);
    expect(result).toEqual(input1);
  });
});
