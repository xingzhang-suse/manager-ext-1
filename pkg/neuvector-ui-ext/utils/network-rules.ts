import { Store } from 'vuex';
import { NetworkRule, UpdateType } from '../types/network-rules';

export async function updateGridData(
    updatedNetworkRules: Array<NetworkRule>,
    targetIndex: number,
    updateType: UpdateType,
    targetId: number = 0,
    store: Store<any>,
) {
    switch (updateType) {
        case UpdateType.AddToTop:
          await insertRule(updatedNetworkRules[0], 0, store);
          break;
        case UpdateType.Insert:
          await insertRule(updatedNetworkRules[0], targetIndex, store);
          break;
        case UpdateType.Edit:
          await replaceRule(updatedNetworkRules[0], targetIndex, store);
          break;
        case UpdateType.MoveBefore:
          await moveRules(updatedNetworkRules, targetId, updateType, store);
          break;
        case UpdateType.MoveAfter:
          await moveRules(updatedNetworkRules, targetId, updateType, store);
          break;
    }
}

async function insertRule(
    updatedNetworkRule: NetworkRule,
    targetIndex: number,
    store: Store<any>,
) {
  await store.dispatch('neuvector/insertNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
  await store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
}

async function replaceRule(
  updatedNetworkRule: NetworkRule,
  targetIndex: number,
  store: Store<any>,
) {
  await store.dispatch('neuvector/removeNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
  await store.dispatch('neuvector/insertNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
  await store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
}

async function moveRules(
    selectedNetworkRules: Array<NetworkRule>,
    targetId: number,
    moveType: UpdateType,
    store: Store<any>,
) {
    let selectedRuleId = selectedNetworkRules.map(rule => rule.id);
    let networkRules: Array<NetworkRule> = await store.getters['neuvector/networkRules'];
    let networkRulesTmp = networkRules.filter(rule => {
      return !selectedRuleId.includes(rule.id);
    });
    let targetIndex = networkRulesTmp.findIndex(rule => rule.id === targetId);
    if (moveType === UpdateType.MoveBefore) {
      networkRulesTmp.splice(targetIndex, 0, ...selectedNetworkRules);
    } else {
      networkRulesTmp.splice(targetIndex + 1, 0, ...selectedNetworkRules);
    }
    await store.dispatch('neuvector/updateNetworkRules', networkRulesTmp);
    await store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
};

export async function toggleDeleteRule(
  selectedRule: NetworkRule,
  targetIndex: number,
  isMasked: Boolean,
  store: Store<any>,
) {
  selectedRule.remove = !isMasked;
  await store.dispatch('neuvector/removeNetworkRule', { networkRule: selectedRule, targetIndex: targetIndex });
  await store.dispatch('neuvector/insertNetworkRule', { networkRule: selectedRule, targetIndex: targetIndex });
  await store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
}

export async function deleteRules(
  networkRules: NetworkRule[],
  selectedRules: NetworkRule[],
  store: Store<any>,
) {
  let index = 0;
  let ids = selectedRules.map(rule => rule.id);
  let networkRulesAfterRemoval = networkRules.map((rule: NetworkRule) => {
    if (rule.id === ids[index] && rule.id !== -1) {
      rule.remove = true;
      index++;
    }
    return rule;
  });
  await store.dispatch('neuvector/updateNetworkRules', networkRulesAfterRemoval);
  await store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
}