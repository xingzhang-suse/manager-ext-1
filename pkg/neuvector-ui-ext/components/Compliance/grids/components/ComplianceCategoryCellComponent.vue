<template>
  <span
    v-if="params.node.data"
    class="h-75 border-0 badge d-inline-flex align-items-center justify-content-center"
    style="background-color: #1154a2; color: white;">
    {{ params.node.data.category }}
  </span>
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
.badge {
  border-radius: 4px;
}
</style>