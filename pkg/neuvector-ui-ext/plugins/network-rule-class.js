import axios from '../interceptor/http-interceptor';
import _axios from 'axios';
import { getSSOUrl } from '../utils/common';
import { PATH } from '../types/path';
import { NV_CONST } from '../types/neuvector';
import * as pako from 'pako'; 

export async function getAutoCompleteData(source) {
    let groupReq = axios({
         url: getSSOUrl(PATH.GROUP_LIST_URL),
            method: 'get',
            params: {
            scope:
            source === NV_CONST.NAV_SOURCE.FED_POLICY
                ? NV_CONST.SCOPE.FED
                : NV_CONST.SCOPE.LOCAL,
        }
    });

    let hostReq = axios({
        url: getSSOUrl(PATH.NODES_URL),
        method: 'get',
    });

    let applicationReq = axios({
        url: getSSOUrl(PATH.POLICY_APP_URL),
        method: 'get',
    });

    return _axios.all([groupReq, hostReq, applicationReq]);
}

export async function promoteNetworkRulesData(payload) {
    return axios({
        url: getSSOUrl(PATH.PROMOTE_NETWORK_RULE),
        method: 'post',
        data: payload,
    });
}

export async function submitNetworkRule(networkRules, source) {
    let networkRulesCopy = JSON.parse(JSON.stringify(networkRules));
    let payload = {};
    let onlyRemove = true;
    let deletedRules = networkRulesCopy
      .map(function (rule) {
        if (rule.remove) {
          return rule.id;
        } else {
          onlyRemove = false;
        }
      })
      .filter(x => !!x);

    networkRulesCopy = networkRulesCopy
      .map(function (rule) {
        if (
          rule.state !== NV_CONST.NETWORK_RULES_STATE.NEW &&
          rule.state !== NV_CONST.NETWORK_RULES_STATE.MODIFIED &&
          !rule.remove
        ) {
          return { id: rule.id };
        } else {
          if (rule.state === NV_CONST.NETWORK_RULES_STATE.NEW)
            rule.id = 0;
          if (!rule.remove) return rule;
        }
      })
      .filter(x => !!x && x.id !== -1);

    if (onlyRemove && deletedRules.length > 0) {
      payload = { delete: deletedRules };
    } else {
      payload = { rules: networkRulesCopy, delete: deletedRules };
    }

    let data = pako.gzip(JSON.stringify(payload));
    data = new Blob([data], { type: 'application/gzip' });
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
      },
      params: {
        scope:
          source === NV_CONST.NAV_SOURCE.FED_POLICY
            ? NV_CONST.SCOPE.FED
            : NV_CONST.SCOPE.LOCAL,
      },
    };
    return axios({
        url: getSSOUrl(PATH.POLICY_URL),
        method: 'patch',
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
        },
        params: {
            scope:
              source === NV_CONST.NAV_SOURCE.FED_POLICY
                ? NV_CONST.SCOPE.FED
                : NV_CONST.SCOPE.LOCAL,
        },
    });
}
