import { StateConfig } from './index';

export default {
    hosts: (state: StateConfig): any[] => state.hosts,
    workloads: (state: StateConfig): any[] => state.workloads,
    rancherWorkloadMap: (state: StateConfig): Map<string, string> => state.rancherWorkloadMap,
    scannedWorkloadMap: (state: StateConfig): Map<string, Object> => state.scannedWorkloadMap,
    scannedNodeMap: (state: StateConfig): Map<string, Object> => state.scannedNodeMap,
}