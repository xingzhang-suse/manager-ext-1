<script>
import { cacheWorkloadsInfo, cacheRancherWorkloadMap } from '../../utils/workloads';

export default {
  async fetch() {
    try {
      await cacheWorkloadsInfo(this.$store);
      let pathSection = location.pathname.split('/');
      let resource = pathSection[pathSection.length - 1];
      let rancherClassifiedworkloads = this.$store.getters['cluster/all'](resource);
      cacheRancherWorkloadMap(rancherClassifiedworkloads, this.$store);
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