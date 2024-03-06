<!-- CustomCell.vue -->
<template>
  <div>
    <img
        v-if="params.data.country_code !== '-'"
        :src="imgSrc"
        width="16px" height="12px;"
        class="mr-2"
        style="margin-top: -3px;" />
    <a :href="'https://www.whois.com/whois/' + params.data.ip" target="_blank">
      <span v-if="params.data.fqdn">
        <span>{{ params.data.fqdn }}</span>
      </span>
      <span v-else>{{ params.data.ip }}</span>
    </a>
  </div>
</template>

<script>


export default {
  components: {
  },
  computed: {
    imgSrc() {
      return require('../../../../assets/img/country-flag/' + this.params.data.country_code.toLowerCase() + '.svg');
    }
  },
  methods: {
    refresh(params) {
      this.params = params
    }
  }
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>