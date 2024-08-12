import { getWorkloads } from '../plugins/workloads-class';
import { nvVariables, NV_CONST } from '../types/neuvector';
import { refreshAuth } from '../plugins/neuvector-class'; 
import { SERVICE } from '@shell/config/types';
import { Store } from 'vuex';

export async function cacheWorkloadsInfo(store: Store<any>) {
  let currentCluster = store.getters['currentCluster'];
  nvVariables.currentCluster = currentCluster.id;
  if ( store.getters['cluster/canList'](SERVICE) ) {
    let allServices = store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
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

export async function cacheRancherWorkloadMap(rancherWorkloads: any[], store: Store<any>) {
  let currentCluster = store.getters['currentCluster'];
  nvVariables.currentCluster = currentCluster.id;
  if ( store.getters['cluster/canList'](SERVICE) ) {
    let allServices = await store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
    console.log('allServices', allServices);
    if ( Array.isArray(allServices) && allServices.length ) {
      nvVariables.ns = allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE)).metadata.namespace
    }
  }
  let authRes = await refreshAuth();
  nvVariables.user = authRes.data.token;
  sessionStorage.nv_token = nvVariables.user.token;
  let rancherWorkloadMap = new Map<string, Object>();
  rancherWorkloads.forEach(workload => {
    let rancherContainerID = workload.status.containerStatuses ? workload.status.containerStatuses[0]?.containerID || '' : '';
    let nvContainerID = rancherContainerID.split('//')[1] || '';
    if (!rancherWorkloadMap.has(nvContainerID)) {
      rancherWorkloadMap.set(workload.id, nvContainerID);
    }
  });
  console.log('rancherWorkloadMap', rancherWorkloadMap);
  store.dispatch('neuvector/updateRancherWorkloadMap', rancherWorkloadMap);
}