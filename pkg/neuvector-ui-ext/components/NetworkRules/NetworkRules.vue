<script>
import Loading from '@shell/components/Loading';
import { SERVICE } from '@shell/config/types';
import { nvVariables, NV_CONST, NV_MAP } from '../../types/neuvector';
import { refreshAuth } from '../../plugins/neuvector-class';
import { getAutoCompleteData } from '../../plugins/network-rule-class';
import { PATH } from '../../types/path';
import { loadPagedData } from '../../utils/common';
import _axios from 'axios';
import NetworkRulesGrid from './grids/NetWorkRulesGrid';

export default {
  props: {
    
  },

  components: {
    Loading,
    NetworkRulesGrid,
  },

  async fetch() {
    if ( this.$store.getters['cluster/canList'](SERVICE) ) {
        this.allServices = await this.$store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
        if ( Array.isArray(this.allServices) && this.allServices.length ) {
            nvVariables.ns = this.allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE)).metadata.namespace
        }
    }
    this.currentCluster = this.$store.getters['currentCluster'];
    nvVariables.currentCluster = this.currentCluster.id;
    await this.loadData();
  },

  data() {
    return {
      eof: false,
      networkRules: [],
      networkRuleErr: false,
      isNetworkRuleChanged: this.$store.getters['neuvector/isNetworkRuleChanged']
    };
  },

  computed: {
    
  },

  methods: {
    loadData: async function() {
      let authRes = await refreshAuth();
      nvVariables.user = authRes.data.token;
      this.getNetworkRules();
      getAutoCompleteData().then(_axios.spread((res1, res2, res3) => {
        console.log(res1, res2, res3)
      }));
    },
    getNetworkRules: function(source='') {
      this.eof = false;
      this.$store.dispatch('neuvector/updateIsNetworkRuleChanged', false);
      this.networkRuleErr = false;
      this.networkRules = [];
      loadPagedData(
        PATH.POLICY_URL,
        this.source === NV_CONST.NAV_SOURCE.FED_POLICY
          ? {
              start: 0,
              limit: NV_CONST.PAGE.NETWORK_RULES,
              scope: NV_CONST.SCOPE.FED,
            }
          : {
              start: 0,
              limit: NV_MAP.PAGE.NETWORK_RULES,
            },
        null,
        this.mergeRulesByWebWorkerClient,
        this.handleError,
        () => {},
      );
    },
    mergeRulesByWebWorkerClient: function(rulesBlock) {
      let eof = rulesBlock.length < NV_MAP.PAGE.NETWORK_RULES;
      this.networkRules = this.networkRules.concat(rulesBlock);
      this.$store.dispatch('neuvector/updateNetworkRulesBackup', this.networkRules);
      this.renderNetworkRule(this.networkRules, eof);
    },
    handleError: function() {
      this.networkRuleErr = true;
      this.renderNetworkRule([], true);
    },
    renderNetworkRule: function(networkRules, eof) {
      this.eof = eof;
      if (networkRules.some(row => row.id === -1)) {
        networkRules.pop();
      }
      if (this.eof) {
        networkRules.push({
          id: -1,
          from: this.t('policy.DEFAULT_RULE'),
          to: '',
          application: [],
          ports: '',
          action: '',
          cfg_type: '',
          last_modified_timestamp: '',
        });
      }
    },
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <div id="network-rules" class="padding-top-0">
            <header style="margin-bottom: 10px;" id="network-rules-title">
                <div class="title">
                    <h1 class="m-0">{{ t('sidebar.nav.POLICY') }}</h1>
                </div>
            </header>
    </div>
    <NetworkRulesGrid :networkRules="networkRules"></NetworkRulesGrid>
  </div>
</template>

<style lang="scss" scoped>
</style>
