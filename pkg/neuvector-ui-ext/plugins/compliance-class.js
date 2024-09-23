import axios from '../interceptor/http-interceptor';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';

export async function getCompliance() {
    return axios({
        url: getSSOUrl(PATH.RISK_COMPLIANCE_URL),
        method: 'get'
    })
}

export async function getAvailableFilters() {
    return axios({
        url: getSSOUrl(PATH.COMPLIANCE_FILTER_URL),
        method: 'get'
    })
}

export async function getDomains() {
    return axios({
        url: getSSOUrl(PATH.DOMAIN_URL),
        method: 'get'
    })
}

export async function getContainerBrief() {
    return axios({
        url: getSSOUrl(PATH.PLAIN_CONTAINER_URL),
        method: 'get'
    })
}