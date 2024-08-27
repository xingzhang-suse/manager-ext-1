<script>
import { cacheNodesInfo } from '../../utils/nodes';

export default {
  async fetch() {
    try {
      await cacheNodesInfo(this.$store);
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