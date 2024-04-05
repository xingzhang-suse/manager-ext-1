<script>
import DashboardView from '../../../../components/Dashboard/DashboardView';
import InstallView from '../../../../components/Dashboard/InstallView';
import { SERVICE } from '@shell/config/types';
import { NV_CONST } from '../../../../types/neuvector';

export default {
  name: 'Dashboard',

  components: { DashboardView, InstallView },

  async fetch() {
    if ( this.$store.getters['cluster/canList'](SERVICE) ) {
      this.allServices = await this.$store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
    }
  },

  data() {
    return {
      allServices: null,
      index: -1
    }
  },

  computed: {
    uiService() {
      if ( Array.isArray(this.allServices) && this.allServices.length ) {
        return this.allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE));
      }

      return null;
    }
  }
};
</script>

<template>
  <InstallView v-if="!uiService" :ui-service="uiService" />
  <DashboardView v-else :ns="uiService.metadata.namespace"/>
</template>
