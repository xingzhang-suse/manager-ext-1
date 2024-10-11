<script>
import Loading from '@shell/components/Loading';
import { SERVICE } from '@shell/config/types';
import { nvVariables, NV_CONST, NV_MAP, RANCHER_CONST } from '../../types/neuvector';
import { refreshAuth } from '../../plugins/neuvector-class';
import { getAutoCompleteData } from '../../plugins/network-rule-class';
import { PATH } from '../../types/path';
import { loadPagedData } from '../../utils/common';
import _axios from 'axios';
import NetworkRulesGrid from './grids/NetWorkRulesGrid';
import AddRuleToTopBtn from './buttons/AddRuleToTopBtn';
import SaveBtn from './buttons/SaveBtn';
import UndoBtn from './buttons/UndoBtn';
import RemoveBtn from './buttons/RemoveBtn';
import Refresh from '../common/buttons/Refresh';
import DownloadCsvBtn from './buttons/DownloadCsvBtn';
import MoveBtn from './buttons/MoveBtn';
import { mapGetters } from 'vuex';

export default {
  props: {
    
  },

  components: {
    Loading,
    NetworkRulesGrid,
    AddRuleToTopBtn,
    SaveBtn,
    UndoBtn,
    RemoveBtn,
    Refresh,
    DownloadCsvBtn,
    MoveBtn,
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
      _networkRules: [],
      networkRuleErr: false,
      autoCompleteData: null,
      NV_CONST: NV_CONST,
    };
  },

  created() {
    this.$store.dispatch('neuvector/updateNetworkRules', null);
    this.$store.dispatch('neuvector/updateIsNetworkRuleListDirty', false);
  },

  computed: {
    ...mapGetters({
      networkRules: 'neuvector/networkRules',
      isNetworkRuleListDirty: 'neuvector/isNetworkRuleListDirty',
    }),
    isLightTheme: function() {
        nvVariables.isLightTheme = sessionStorage.getItem(RANCHER_CONST.R_THEME) !== RANCHER_CONST.THEME.DARK;
        return nvVariables.isLightTheme;
    }
  },

  methods: {
    loadData: async function() {
      try {
        let authRes = await refreshAuth();
        nvVariables.user = authRes.data.token;
        this.getNetworkRules();
        getAutoCompleteData().then(_axios.spread((groupsRes, hostsRes, applicationsRes) => {
          this.autoCompleteData = {
            endpointOptions: hostsRes.data.hosts.map(host => `Host:${host.name}`).concat(groupsRes.data.groups.map(group => group.name)),
            applicationOptions: applicationsRes.data.list.application,
          }
        }));
      } catch(error) {
        console.error(error);
        this.networkRuleErr = true;
      }
      
    },
    getNetworkRules: function(source='') {
      this.eof = false;
      this.$store.dispatch('neuvector/updateIsNetworkRuleChanged', false);
      this.$store.dispatch('neuvector/updateNetworkRules', null);
      this.networkRuleErr = false;
      this._networkRules = [];
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
      this._networkRules = this._networkRules.concat(rulesBlock);
      this.renderNetworkRule(this._networkRules, eof);
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
      this.$store.dispatch('neuvector/updateNetworkRulesBackup', this._networkRules);
      this.$store.dispatch('neuvector/updateNetworkRules', this._networkRules);
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
    <div>
      <AddRuleToTopBtn v-if="autoCompleteData" :autoCompleteData="autoCompleteData" :isLightTheme="isLightTheme" class="pull-left mx-2"></AddRuleToTopBtn>
      <SaveBtn v-if="isNetworkRuleListDirty" class="pull-left mx-2" :reloadFn="getNetworkRules"></SaveBtn>
      <UndoBtn v-if="isNetworkRuleListDirty" class="pull-left mx-2" :reloadFn="getNetworkRules"></UndoBtn>
      <RemoveBtn class="pull-left mx-2"></RemoveBtn>
      <MoveBtn class="pull-left mx-2"></MoveBtn>
      <Refresh class="pull-right" :reloadData="loadData"></Refresh>
      <DownloadCsvBtn class="pull-right mx-2" :networkRules="networkRules"></DownloadCsvBtn>
    </div>
    
    <NetworkRulesGrid
      v-if="autoCompleteData && networkRules?.length > 0"
      class="mt-2"
      :networkRules="networkRules"
      :autoCompleteData="autoCompleteData"
      :source="NV_CONST.NAV_SOURCE.SELF"
    ></NetworkRulesGrid>
    <div v-else-if="networkRules?.length === 0" class="text-center mt-5">
      {{ t('general.NO_ROWS') }}
    </div>
  </div>
</template>
