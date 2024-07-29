import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export async function getEnforcer(enforceId) {
    return axios({
        url: getSSOUrl(PATH.SINGLE_ENFORCER),
        method: 'get',
        params: {
          id: enforceId
        }
    });
};

export async function getWorkload(workloadId) {
    return axios({
        url: getSSOUrl(PATH.CONTAINER_BY_ID),
        method: 'get',
        params: {
          id: workloadId
        }
    });
};

export async function getHost(hostId) {
    return axios({
        url: getSSOUrl(PATH.NODES_URL),
        method: 'get',
        params: {
          id: hostId
        }
    });
};

export async function getPackets(threatId) {
    return axios({
        url: getSSOUrl(PATH.THREAT_URL),
        method: 'get',
        params: {
          id: threatId
        }
    });
}

export async function getSecEvents() {
    return axios({
        url: getSSOUrl(PATH.SECURITY_EVENTS_URL_2),
        method: 'get'
    });
}