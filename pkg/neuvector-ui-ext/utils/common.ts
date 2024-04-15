import { NV_CONST, nvVariables } from '../types/neuvector';

export function arrayToCsv(array: any, title: string = '') {
    let line: string = '';
    let result: string = '';
    let columns: string[] = [];
    if (title.length > 0) {
      result += title + '\r\n';
    }
    let i: number = 0;
    for (let key in array[0]) {
      let keyString = key + ',';
      columns[i] = key;
      line += keyString;
      i++;
    }
  
    line = line.slice(0, -1);
    result += line + '\r\n';
  
    for (let i = 0; i < array.length; i++) {
      let line = '';
  
      for (let j = 0; j < columns.length; j++) {
        let value = array[i][columns[j]];
        if (value === undefined || value === null) value = '';
        line += `"${value}"` + ',';
      }
  
      line = line.slice(0, -1);
      result += line + '\r\n';
    }
    return result;
}

export function getDisplayName(originalName: string) {
  if (originalName) {
    const kube = 'k8s';
    let nameSec = originalName.split('_');
    if (nameSec[0] === kube) {
      return nameSec[2];
    } else {
      return originalName;
    }
  }
  return '';
}

export function isIpV4(str: string): boolean {
  let pattern = new RegExp(
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  );
  return pattern.test(str);
}

export function isIpV6(str: string): boolean {
  let pattern = new RegExp(
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/
  );
  return pattern.test(str);
}

export function getI18Name(name: any, store: any) {
  return store.getters['i18n/t']('enum.' + name.toUpperCase());
}

export function getSSOUrl(path: string) {
  return `/k8s/clusters/${ nvVariables.currentCluster }/api/v1/namespaces/${ nvVariables.ns }/services/https:${ NV_CONST.NV_SERVICE }${ NV_CONST.PROXY_VALUE }/${ path }`;
}