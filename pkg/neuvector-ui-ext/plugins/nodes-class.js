import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export async function getHosts() {
    return axios({
        url: getSSOUrl(PATH.NODES_URL),
        method: 'get',
    });
};

export async function getHostVulnerabilities(id) {
    return axios({
        url: getSSOUrl(PATH.SCAN_HOST_URL),
        method: 'get',
        params: {
            id: id
        }
    });
};
