import { StateConfig } from './index';
import { NetworkRule } from 'types/network-rules';
import { UserPermissions } from 'types/neuvector';

export default {
    hosts: (state: StateConfig): any[] => state.hosts,
    workloads: (state: StateConfig): any[] => state.workloads,
    rancherWorkloadMap: (state: StateConfig): Map<string, string> => state.rancherWorkloadMap,
    scannedWorkloadMap: (state: StateConfig): Map<string, Object> => state.scannedWorkloadMap,
    scannedNodeMap: (state: StateConfig): Map<string, Object> => state.scannedNodeMap,
    isNetworkRuleChanged: (state: StateConfig): Boolean => state.isNetworkRuleChanged,
    networkRules: (state: StateConfig): NetworkRule[] | null => state.networkRules,
    networkRulesBackup: (state: StateConfig): NetworkRule[] => state.networkRulesBackup,
    isNetworkRuleListDirty: (state: StateConfig): Boolean => state.isNetworkRuleListDirty,
    newId: (state: StateConfig): number => state.newId,
    tokenBakeup: (state: StateConfig): string => state.tokenBakeup,
    userPermission: (state: StateConfig): UserPermissions => state.userPermission,
    responseRules: (state: StateConfig): any[] | null => state.responseRules,
    responseRuleConditionOptions: (state: StateConfig): Object => state.responseRuleConditionOptions,
}