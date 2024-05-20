import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export async function postVulnerabilityQuery(vulQuery) {
    return axios({
        url: getSSOUrl(PATH.VUL_ASSET_URL),
        method: 'post',
        data: vulQuery
    });
}

export async function getVulnerabilitiesQuery(params) {
    return axios({
        url: getSSOUrl(PATH.VUL_ASSET_URL),
        method: 'get',
        params: params
    });
}

export async function postCVEProfile(config) {
    return axios({
        url: getSSOUrl(PATH.CVE_PROFILE_ENTRY),
        method: 'post',
        data: config
    });
}