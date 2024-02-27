<script>
import DashboardReportSelection from '../buttons/DashboardReportSelection';
export default {
  components: {
    DashboardReportSelection
  },
  props: {
    icon: String,
    color: String,
    message: String
  }
};
</script>

<template>
    <div class="text-center">
        <h5><strong>{{ t('dashboard.report.TITLE') }}</strong></h5>
        <p>{{ t('dashboard.report.DESC') }}</p>
        <DashboardReportSelection/>
    </div>
</template>