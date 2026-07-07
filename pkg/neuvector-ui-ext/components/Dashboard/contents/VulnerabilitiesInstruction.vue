<template>
  <div v-if="autoScan">
    {{ t('dashboard.heading.guideline.VUL_EXPLOIT') }}
  </div>
  <div v-else>
    {{ t('dashboard.heading.guideline.AUTO_SCAN_OFF') }}
    <div v-if="isAutoScanAuthorized" class="toggle-switch mt-10">
      <ToggleSwitch @update:value="toggleAutoScan" :value="autoScan" :offLabel="'Auto Scan'" />
    </div>
  </div>
</template>
<script>
import { ToggleSwitch } from '@components/Form/ToggleSwitch';
import { updateAutoScan } from '../../../plugins/dashboard-class';
import { getDisplayFlag } from '../../../utils/auth';
import { refreshAuth } from '../../../plugins/neuvector-class';
import { nvVariables } from '../../../types/neuvector';

export default {

  async fetch() {
    let authRes = await refreshAuth();
    nvVariables.user = authRes.data.token;
    this.isAutoScanAuthorized = getDisplayFlag('runtime_scan', this.$store);
  },
  props: {
    autoScan: Boolean,
    token: String,
    ns: String,
    currentClusterId: String
  },
  data() {
    return {
      isAutoScanAuthorized: false
    };
  },
  components: {
    ToggleSwitch,
  },
  computed: {
  },
  methods: {
    async toggleAutoScan(autoScan) {
      try {
        let autoScanRes = await updateAutoScan(autoScan);
        this.autoScan = autoScan;
      } catch(error) {
        console.error(error);
      }
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
 </style>../../../plugins/dashboard-class