<template>
  <button
    class="btn btn-sm role-secondary"
    @click="params.downloadCsv(params)"
    aria-label="Download CSV icon button "
  >
    <i class="icon icon-download"></i>
  </button>
</template>

<script>

export default {
  components: {
  },
  computed: {
  },
  methods: {
    refresh(params) {
      this.params = params
    }
  }
};
</script>

<style scoped>
.btn-sm {
  min-height: 24px;
}
</style>