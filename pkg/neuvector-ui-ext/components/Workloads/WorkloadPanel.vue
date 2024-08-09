<script>
import { cacheWorkloadsInfo } from '../../utils/workloads';
import { POD } from '@shell/config/types';

export default {
  async fetch() {
    try {
      await cacheWorkloadsInfo(this.$store);
      let rancherPods = this.$store.getters['cluster/all'];
      console.log('rancherPods', rancherPods);
    } catch(error) {
      console.error(error)
    }
  }
};
</script>

<template>
  <div class="reporter-panel">
  </div>
</template>

<style lang="scss" scoped>
.reporter-panel {
  display: none;
}
</style>