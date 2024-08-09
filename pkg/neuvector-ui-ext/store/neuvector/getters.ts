import { StateConfig } from './index';

export default {
    hosts: (state: StateConfig): any[] => state.hosts,
    workloads: (state: StateConfig): any[] => state.workloads,
}