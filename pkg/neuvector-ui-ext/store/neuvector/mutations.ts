import { StateConfig } from './index';
import _ from 'lodash';

export default {
    updateHosts(state: StateConfig, hosts: any[]) {
        state.hosts = hosts;
    },
    updateWorkloads(state: StateConfig, workloads: any[]) {
        state.workloads = workloads;
    },
    updateRancherWorkloadMap(state: StateConfig, rancherWorkloadMap: Map<string, string>) {
        state.rancherWorkloadMap = rancherWorkloadMap;
    },
    updateScannedWorkloadMap(state: StateConfig, entry: {workloadID: string, scannedResult: Object}) {
        state.scannedWorkloadMap.set(entry.workloadID, entry.scannedResult);
    },
    updateScannedNodeMap(state: StateConfig, entry: {nodeID: string, scannedResult: Object}) {
        state.scannedNodeMap.set(entry.nodeID, entry.scannedResult);
    },
    updateIsNetworkRuleChanged(state: StateConfig, isNetworkRuleChanged: Boolean) {
        state.isNetworkRuleChanged = isNetworkRuleChanged;
    },
    updateNetworkRulesBackup(state: StateConfig, networkRules: any[]) {
        state.networkRulesBackup = _.cloneDeep(networkRules);
    },
}