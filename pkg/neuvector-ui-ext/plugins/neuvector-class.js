import isEmpty from 'lodash/isEmpty';
import semver from 'semver';
import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export function getLatestStableVersion(versions) {
  const allVersions = versions.map(v => v.version);
  const stableVersions = versions.filter(v => !v.version.includes('b'));

  if ( isEmpty(stableVersions) && !isEmpty(allVersions) ) {
    return semver.rsort(allVersions)[0];
  }

  return stableVersions?.sort((a, b) => {
    const versionA = a.version.split('.').map(Number);
    const versionB = b.version.split('.').map(Number);

    for ( let i = 0; i < Math.max(versionA.length, versionB.length); i++ ) {
    if ( versionA[i] === undefined || versionA[i] < versionB[i] ) {
        return 1;
    }
    if ( versionB[i] === undefined || versionA[i] > versionB[i] ) {
        return -1;
    }
    }

    return 0;
  })[0];
}

export async function getAuth() {
  return axios({
      url: getSSOUrl(PATH.LOGIN_URL),
      method: 'post',
      data: {
          username: '',
          password: '',
          isRancherSSOUrl: true
      }
  });
}

export async function refreshAuth(tokenInfo) {
  return axios({
    url: getSSOUrl(PATH.SELF_URL),
    method: 'get',
    params: {
      isOnNV: true,
      isRancherSSOUrl: true
    }
});
}