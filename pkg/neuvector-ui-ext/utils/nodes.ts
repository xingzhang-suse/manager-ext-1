import { getHosts } from '../plugins/nodes-class';
import { nvVariables, NV_CONST } from '../types/neuvector';
import { refreshAuth } from '../plugins/neuvector-class'; 
import { SERVICE } from '@shell/config/types';

export async function cacheNodesInfo(store: any) {
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
  let nodeRes = await getHosts();
  store.dispatch('neuvector/updateHosts', preprocessNeuVectorHostsData(nodeRes.data.hosts));
}

function preprocessNeuVectorHostsData(hosts: any[]) {
  let hostKV = new Map();
  hosts.forEach(host => {
    Object.values(host.interfaces).forEach((_interface: any) => {
      _interface.forEach((interfaceDetail: any) => {
          hostKV.set(interfaceDetail.ip, host);
      });
    });
    hostKV.set(host.name, host);
  });
  return hostKV;
}