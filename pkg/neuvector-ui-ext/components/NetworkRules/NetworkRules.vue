<script>
import Loading from '@shell/components/Loading';

export default {
  props: {
    
  },

  components: {

  },

  async fetch() {
    
  },

  data() {
   return {
    
   }
  },

  computed: {
    
  },

  methods: {
    
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <div id="network-rules" class="padding-top-0">
            <header style="margin-bottom: 10px;" id="network-rules-title">
                <div class="title">
                    <h1 class="m-0">{{ t('sidebar.nav.POLICY') }}</h1>
                </div>
            </header>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
