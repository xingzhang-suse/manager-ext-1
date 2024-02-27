<script>
import ButtonDropdown from '@shell/components/ButtonDropdown';
export default {
    components: {
        ButtonDropdown
    },
  
    props: {
    },

    computed: {
      dropdownOptions: function() {
        return [
          this.t('dashboard.report.ALL')
        ]
      },
      buttonLabel: function() {
        return this.t('dashboard.report.REPORT')
      }
    },
  
    methods: {
      selectDomain: function(selectedOption) {
        if (selectedOption === this.t('dashboard.report.ALL')) {
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      }
    }
}
</script>
  
<template>
  <ButtonDropdown class="report-btn" :dropdownOptions="dropdownOptions" :buttonLabel="buttonLabel" @click-action="selectDomain"/>
</template>

<style>
  .report-btn {
    margin-top: 10px;
    width: 100px;
  }
  .report-btn .btn {
      min-height: 20px; 
      line-height: 20px;
  }
  .dashboard .head-title span {
    background-color: unset;
  }
</style>