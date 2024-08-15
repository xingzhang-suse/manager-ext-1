import { CoreStoreSpecifics, CoreStoreConfig } from '@shell/core/types';
import { NEUVECTOR_PRODUCT_NAME } from '../../types/neuvector'
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export interface StateConfig {
    hosts: any[],
    workloads: any[],
    rancherWorkloadMap: Map<string, string>,
    scannedWorkloadMap: Map<string, Object>,
    scannedNodeMap: Map<string, Object>,
}

const neuvectorFactory = (config: StateConfig): CoreStoreSpecifics => {
    return {
        state: (): StateConfig => {
            return {
                hosts: config.hosts,
                workloads: config.workloads,
                rancherWorkloadMap: config.rancherWorkloadMap,
                scannedWorkloadMap: config.scannedWorkloadMap,
                scannedNodeMap: config.scannedNodeMap,
            }
        },
        getters:   { ...getters },
        mutations: { ...mutations },
        actions:   { ...actions },
    };
};

const config: CoreStoreConfig = { namespace: NEUVECTOR_PRODUCT_NAME };

export default {
    specifics: neuvectorFactory(
        {
            hosts: [],
            workloads: [],
            rancherWorkloadMap: new Map<string, string>(),
            scannedWorkloadMap: new Map<string, Object>(),
            scannedNodeMap: new Map<string, Object>(),
        }
    ),
    config,
}