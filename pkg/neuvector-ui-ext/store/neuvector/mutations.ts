import { StateConfig } from './index';
export default {
    updateHosts(state: StateConfig, hosts: any[]) {
        state.hosts = hosts;
    },
    updateWorkloads(state: StateConfig, workloads: any[]) {
        state.workloads = workloads;
    }
}