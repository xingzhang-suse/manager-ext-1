import { getWorkloads } from '../plugins/workloads-class';
import { Store } from 'vuex';
import { cacheNvNamespace } from '../utils/common';

export async function cacheWorkloadsInfo(store: Store<any>) {
    await cacheNvNamespace(store);
    let workloadRes = await getWorkloads();
    store.dispatch('neuvector/updateWorkloads', preprocessNeuVectorWorkloadsData(workloadRes.data.workloads));
}

function preprocessNeuVectorWorkloadsData(workloads: any[]) {
  let workloadKV = new Map();
  
  return workloadKV;
}

export async function cacheRancherWorkloadMap(rancherWorkloads: any[], store: Store<any>) {
  await cacheNvNamespace(store);
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