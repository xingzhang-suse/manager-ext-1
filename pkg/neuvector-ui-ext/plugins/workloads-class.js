import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export async function getWorkloads() {
    return axios({
        url: getSSOUrl(PATH.SCANNED_CONTAINER_URL),
        method: 'get',
    });
};

export async function getWorkloadVulnerabilities(id) {
    return axios({
        url: getSSOUrl(PATH.SCAN_URL),
        method: 'get',
        params: {
            id: id
        }
    });
};
