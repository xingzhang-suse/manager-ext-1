import { getWorkloads } from '../plugins/workloads-class';
import { nvVariables, NV_CONST } from '../types/neuvector';
import { refreshAuth } from '../plugins/neuvector-class'; 
import { SERVICE } from '@shell/config/types';

export async function cacheWorkloadsInfo(store: any) {
  let currentCluster = store.getters['currentCluster'];
  nvVariables.currentCluster = currentCluster.id;
  if ( store.getters['cluster/canList'](SERVICE) ) {
    let allServices = await store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
    if ( Array.isArray(allServices) && allServices.length ) {
      nvVariables.ns = allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE)).metadata.namespace
    }
  }
  let authRes = await refreshAuth();
  nvVariables.user = authRes.data.token;
  sessionStorage.nv_token = nvVariables.user.token;
  let workloadRes = await getWorkloads();
  store.dispatch('neuvector/updateWorkloads', preprocessNeuVectorWorkloadsData(workloadRes.data.workloads));
}

function preprocessNeuVectorWorkloadsData(workloads: any[]) {
  let workloadKV = new Map();
  
  return workloadKV;
}