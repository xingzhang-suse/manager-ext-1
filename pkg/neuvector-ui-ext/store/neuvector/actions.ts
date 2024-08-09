export default {
    updateHosts({ commit }: any, hosts: any[]) {
        commit('updateHosts', hosts);
    },
    updateWorkloads({ commit }: any, workloads: any[]) {
        commit('updateWorkloads', workloads);
    }
}