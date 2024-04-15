import { nvVariables } from '../types/neuvector';

export function getRowBasedPermission(domain: string, neededPermission: string) {
    let gPermissions = nvVariables.user.global_permissions;
    let dPermissions = nvVariables.user.domain_permissions;
    let result = '';
    for (let gPermission of gPermissions) {
      if (neededPermission === gPermission.id) {
        result = gPermission.write ? 'w' : 'r';
        break;
      }
    }
    if (result === 'w') return result;
    if (dPermissions[domain]) {
      for (let dPermission of dPermissions[domain]) {
        if (neededPermission === dPermission.id) {
          result = dPermission.write ? 'w' : 'r';
          break;
        }
      }
    }
    return result;
}