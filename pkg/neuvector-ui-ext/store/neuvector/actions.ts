import { NetworkRule } from 'types/network-rules';
import { UserPermissions } from 'types/neuvector';

export default {
    updateHosts({ commit }: any, hosts: any[]) {
        commit('updateHosts', hosts);
    },
    updateWorkloads({ commit }: any, workloads: any[]) {
        commit('updateWorkloads', workloads);
    },
    updateRancherWorkloadMap({ commit }: any, rancherWorkloadMap: Map<string, string>) {
        commit('updateRancherWorkloadMap', rancherWorkloadMap);
    },
    updateScannedWorkloadMap({ commit }: any, entry: {workloadID: string, scannedResult: Object} ) {
        commit('updateScannedWorkloadMap', entry);
    },
    updateScannedNodeMap({ commit }: any, entry: {nodeID: string, scannedResult: Object}) {
        commit('updateScannedNodeMap', entry);
    },
    updateIsNetworkRuleChanged({ commit }: any, entry: Boolean) {
        commit('updateIsNetworkRuleChanged', entry);
    },
    updateNetworkRules({ commit }: any, networkRules: NetworkRule[]) {
        commit('updateNetworkRules', networkRules);
    },
    insertNetworkRule({ commit }: any, entry: {networkRule: NetworkRule, targetIndex: number}) {
        commit('insertNetworkRule', entry);
    },
    removeNetworkRule({ commit }: any, entry: {networkRule: NetworkRule, targetIndex: number}) {
        commit('removeNetworkRule', entry);
    },
    updateIsNetworkRuleListDirty({ commit }: any, isNetworkRuleListDirty: Boolean) {
        commit('updateIsNetworkRuleListDirty', isNetworkRuleListDirty);
    },
    updateNetworkRulesBackup({ commit }: any, networkRules: any[]) {
        commit('updateNetworkRulesBackup', networkRules);
    },
    increaseNewId({ commit }: any) {
        commit('increaseNewId');
    },
    initializeNewId({ commit }: any) {
        commit('initializeNewId');
    },
    updateTokenBakeup({ commit }: any, tokenBakeup: string) {
        commit('updateTokenBakeup', tokenBakeup);
    },
    updateUserPermission({ commit }: any, userPermission: UserPermissions) {
        commit('updateUserPermission', userPermission);
    },
}