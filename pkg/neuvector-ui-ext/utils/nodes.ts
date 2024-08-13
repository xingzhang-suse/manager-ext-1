import { getHosts } from '../plugins/nodes-class';
import { Store } from 'vuex';
import { cacheNvNamespace } from '../utils/common';

export async function cacheNodesInfo(store: Store<any>) {
  if (store.getters['neuvector/hosts'].length === 0) {
    await cacheNvNamespace(store);
    let nodeRes = await getHosts();
    store.dispatch('neuvector/updateHosts', preprocessNeuVectorHostsData(nodeRes.data.hosts));
  }
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