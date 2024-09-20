import { Store } from 'vuex';
import { NetworkRule, UpdateType } from '../types/network-rules';

export function updateGridData(
    updatedNetworkRules: Array<NetworkRule>,
    targetIndex: number,
    updateType: UpdateType,
    targetId: number = 0,
    store: Store<any>,
) {
    switch (updateType) {
        case UpdateType.AddToTop:
          insertRule(updatedNetworkRules[0], -1, store);
          break;
        case UpdateType.Insert:
          insertRule(updatedNetworkRules[0], targetIndex, store);
          break;
        case UpdateType.Edit:
          replaceRule(updatedNetworkRules[0], targetIndex, store);
          break;
        case UpdateType.MoveBefore:
          moveRules(updatedNetworkRules, targetId, updateType, store);
          break;
        case UpdateType.MoveAfter:
          moveRules(updatedNetworkRules, targetId, updateType, store);
          break;
    }
}

function insertRule(
    updatedNetworkRule: NetworkRule,
    targetIndex: number,
    store: Store<any>,
) {
  store.dispatch('neuvector/insertNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
  store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
}

function replaceRule(
  updatedNetworkRule: NetworkRule,
  targetIndex: number,
  store: Store<any>,
) {
  store.dispatch('neuvector/removeNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
  setTimeout(() => {
    store.dispatch('neuvector/insertNetworkRule', { networkRule: updatedNetworkRule, targetIndex: targetIndex });
    store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
  }, 200);
}

function moveRules(
    selectedNetworkRules: Array<NetworkRule>,
    targetId: number,
    moveType: UpdateType,
    store: Store<any>,
) {
    let selectedRuleId = selectedNetworkRules.map(rule => rule.id);
    let networkRules: Array<NetworkRule> = store.getters['neuvector/networkRules'];
    let networkRulesTmp = networkRules.filter(rule => {
      return !selectedRuleId.includes(rule.id);
    });
    let targetIndex = networkRulesTmp.findIndex(rule => rule.id === targetId);
    if (moveType === UpdateType.MoveBefore) {
      networkRulesTmp.splice(targetIndex, 0, ...selectedNetworkRules);
    } else {
      networkRulesTmp.splice(targetIndex + 1, 0, ...selectedNetworkRules);
    }
    store.dispatch('neuvector/updateNetworkRules', networkRulesTmp);
    store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
};

export async function toggleDeleteRule(
  selectedRule: NetworkRule,
  targetIndex: number,
  isMasked: Boolean,
  store: Store<any>,
) {
  selectedRule.remove = !isMasked;
  store.dispatch('neuvector/removeNetworkRule', { networkRule: selectedRule, targetIndex: targetIndex });
  setTimeout(() => {
    store.dispatch('neuvector/insertNetworkRule', { networkRule: selectedRule, targetIndex: targetIndex });
    store.dispatch('neuvector/updateIsNetworkRuleListDirty', true);
  }, 200);
}