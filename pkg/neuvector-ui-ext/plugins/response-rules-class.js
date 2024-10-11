import axios from '../interceptor/http-interceptor';
import _axios from 'axios';
import { getSSOUrl } from '../utils/common';
import { getCfgType } from '../plugins/neuvector-class';
import { PATH } from '../types/path';
import { NV_CONST } from '../types/neuvector';
import { UpdateType } from '../types/network-rules';
import { parseConditions, filterSelectedOptions } from '../utils/response-rules';

export async function getResponseRulesData(scope) {
    if (scope === NV_CONST.SCOPE.FED)
        return axios({
            url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
            method: 'get',
            params: { scope: scope }
        });
    else
        return axios({
            url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
            method: 'get',
        });
}

export async function getAutoCompleteData(scope) {
    let groupReq = axios({
        url: getSSOUrl(PATH.GROUP_URL),
        method: 'get',
        params: { scope: scope }
    });
    let optionsReq = axios({
        url: getSSOUrl(PATH.CONDITION_OPTION_URL),
        method: 'get',
        params: { scope: scope }
    });
    return _axios.all([groupReq, optionsReq]);
}

export async function insertUpdateResponseRuleData(responseRule, actionList, type, webhookOptions, scope) {
    let payload;
    console.log('responseRule', responseRule, type, UpdateType.Insert);
    if (type === UpdateType.Insert || type === UpdateType.AddToTop) {
        payload = {
            insert: {
                after: type === UpdateType.AddToTop ? 0 : responseRule.id,
                rules: [
                    {
                        event: responseRule.event,
                        comment: responseRule.comment,
                        group: responseRule.group || '',
                        conditions: parseConditions(responseRule.conditions),
                        actions: filterSelectedOptions(
                            responseRule.actions,
                            actionList
                        ),
                        disable: responseRule.disable,
                        cfg_type: getCfgType(scope),
                        webhooks: filterSelectedOptions(
                            responseRule.webhooks,
                            webhookOptions
                        ),
                    },
                ],
            },
        };
        console.log('Insert', payload);
        return axios({
            url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
            method: 'post',
            data: payload,
        });
    } else {
        if (type === UpdateType.Edit) {
                payload = {
                    config: {
                        id: responseRule.id,
                        event: responseRule.event,
                        comment: responseRule.comment,
                        group: responseRule.group || '',
                        conditions: parseConditions(responseRule.conditions),
                        actions: filterSelectedOptions(
                            responseRule.actions,
                            actionList
                        ),
                        disable: responseRule.disable,
                        cfg_type: getCfgType(scope),
                        webhooks: filterSelectedOptions(
                            responseRule.webhooks,
                            webhookOptions
                        ),
                    },
                };
        } else {
                payload = {
                    config: responseRule,
                };
        }
        console.log('payload', payload);
        return axios({
            url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
            method: 'patch',
            data: payload,
        });
    }
}

export async function removeResponseRuleData(id, scope) {
    return axios({
        url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
        method: 'delete',
        params: {
            id: id, 
            scope: scope,
        }
    });
}

export async function unquarantineAndRemoveResponseRuleData(id, scope) {
    let payload = {
        request: {
            unquarantine: {
                response_rule: id,
            },
        },
    };
    let unquarantineReq = axios({
        url: getSSOUrl(PATH.UNQUARANTINE_URL),
        method: 'post',
        data: payload
    });
    let removeReq = axios({
        url: getSSOUrl(PATH.RESPONSE_POLICY_URL),
        method: 'delete',
        params: {
            id: id,
            scope: scope,
        }
    });
    return _axios.all([unquarantineReq, removeReq]);
}