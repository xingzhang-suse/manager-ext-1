import { StateConfig } from './index';
import { NetworkRule } from 'types/network-rules';

export default {
    hosts: (state: StateConfig): any[] => state.hosts,
    workloads: (state: StateConfig): any[] => state.workloads,
    rancherWorkloadMap: (state: StateConfig): Map<string, string> => state.rancherWorkloadMap,
    scannedWorkloadMap: (state: StateConfig): Map<string, Object> => state.scannedWorkloadMap,
    scannedNodeMap: (state: StateConfig): Map<string, Object> => state.scannedNodeMap,
    isNetworkRuleChanged: (state: StateConfig): Boolean => state.isNetworkRuleChanged,
    networkRules: (state: StateConfig): NetworkRule[] => state.networkRules,
    networkRulesBackup: (state: StateConfig): NetworkRule[] => state.networkRulesBackup,
    isNetworkRuleListDirty: (state: StateConfig): Boolean => state.isNetworkRuleListDirty,
    newId: (state: StateConfig): number => state.newId,
}