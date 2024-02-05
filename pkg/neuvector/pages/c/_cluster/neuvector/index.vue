<script>
import DashboardView from '../../../../components/Dashboard/DashboardView';
import InstallView from '../../../../components/Dashboard/InstallView';
import { SERVICE } from '@shell/config/types';

export default {
  name: 'Dashboard',

  components: { DashboardView, InstallView },

  async fetch() {
    if ( this.$store.getters['cluster/canList'](SERVICE) ) {
      this.allServices = await this.$store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
      
      console.log(this.allServices);
      console.log(this.$store.getters['cluster/findAll'])
    }
  },

  data() {
    return {
      allServices: null,
      index: -1
    }
  },

  computed: {
    hasSchema() {
      if ( this.allServices ) {
        this.allServices.forEach(svc => console.log(svc));
        this.index = this.allServices.findIndex(svc => svc?.id.includes('neuvector-service-webui'));
        console.log('index:',this.index)
      }
      return this.index !== -1;
    }
  }
};
</script>

<template>
  <InstallView v-if="!hasSchema" :has-schema="hasSchema" />
  <DashboardView v-else :ns="this.allServices[this.index].metadata.namespace"/>
</template>
