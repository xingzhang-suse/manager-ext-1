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
    }
}