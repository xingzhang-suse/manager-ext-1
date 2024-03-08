<template>
  <div v-if="autoScan">
    {{ t('dashboard.heading.guideline.VUL_EXPLOIT') }}
  </div>
  <div v-else>
    {{ t('dashboard.heading.guideline.AUTO_SCAN_OFF') }}
    <div class="toggle-switch mt-10">
      <ToggleSwitch @input="toggleAutoScan" :value="autoScan" :offLabel="'Auto Scan'" />
    </div>
  </div>
</template>
<script>
import { ToggleSwitch } from '@components/Form/ToggleSwitch';
import axios from 'axios';

export default {
  fetch() {

  },
  props: {
    autoScan: Boolean,
    token: String,
    ns: String
  },
  components: {
    ToggleSwitch,
  },
  computed: {
  },
  methods: {
    toggleAutoScan(autoScan) {
      axios({
        url: `/api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/scan/config`,
        method: 'post',
        headers: {
          token: this.token
        },
        data: {config: {auto_scan: autoScan}}
      }).then(res => {
        this.autoScan = autoScan;
      }).catch(err => {});
    }
  }
}
 </script>
 
 <style lang="scss">
 .toggle-switch {
  justify-content: center;
  display: grid;
  text-align: center;
 }
 </style>