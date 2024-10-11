import { CoreStoreSpecifics, CoreStoreConfig } from '@shell/core/types';
import { NEUVECTOR_PRODUCT_NAME, NV_CONST } from '../../types/neuvector'
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { NetworkRule } from 'types/network-rules';
import { UserPermissions } from 'types/neuvector';

export interface StateConfig {
    hosts: any[],
    workloads: any[],
    rancherWorkloadMap: Map<string, string>,
    scannedWorkloadMap: Map<string, Object>,
    scannedNodeMap: Map<string, Object>,
    isNetworkRuleChanged: Boolean,
    networkRules: NetworkRule[] | null,
    networkRulesBackup: NetworkRule[],
    isNetworkRuleListDirty: Boolean,
    newId: number,
    tokenBakeup: string,
    userPermission: UserPermissions,
    responseRules: any[] | null,
    responseRuleConditionOptions: Object,
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
                isNetworkRuleChanged: config.isNetworkRuleChanged,
                networkRules: config.networkRules,
                networkRulesBackup: config.networkRulesBackup,
                isNetworkRuleListDirty: config.isNetworkRuleListDirty,
                newId: config.newId,
                tokenBakeup: config.tokenBakeup,
                userPermission: config.userPermission,
                responseRules: config.responseRules,
                responseRuleConditionOptions: config.responseRuleConditionOptions,
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
            isNetworkRuleChanged: false,
            networkRules: null,
            networkRulesBackup: [],
            isNetworkRuleListDirty: false,
            newId: NV_CONST.NEW_ID_SEED.NETWORK_RULE,
            tokenBakeup: '',
            userPermission: {
                globalPermissions: [],
                remoteGlobalPermissions: [],
                ownedPermissions: [],
                isNamespaceUser: false,
            },
            responseRules: null,
            responseRuleConditionOptions: {},
        }
    ),
    config,
}