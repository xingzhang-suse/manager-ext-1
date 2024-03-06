<script>
export default {
  components: {

  },

  mixins: [],

  async fetch() {
    
  },

  computed: {
    
  },

  methods: {
  
  }
};
</script>

<template>
  <div class="policy-coverage-comment">
    <div>
      <span class="label label-caution">Caution</span>
    </div>
    <div class="text-muted policy-coverage-comment-text">
      {{ t('dashboard.body.comments.CAUTION_POD') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .policy-coverage-comment {
        padding: 40px 15px;
        font-size: 14px;
        .policy-coverage-comment-text {
            padding: 10px 0;
        }
    }
    .label-caution {
        background-color: #ffcb02;
        color: #545454;
        padding: 5px;
        font-size: 12px;
        font-weight: bold;
    }
</style>
