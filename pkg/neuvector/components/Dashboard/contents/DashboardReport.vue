<script>
export default {
  components: {

  },
  props: {
  }
};
</script>

<template>
    <div>
        <div class="page-cover">
            <div class="page-cover-decro"></div>
            <div class="page-cover-logo"></div>
            <div class="page-cover-title">
                {{ t('dashboard.report.TITLE') }}
                <!-- <div class="margin-top-m" style="font-size: 30px;">{{domain ? '&nbsp;(&nbsp;' + domain + '&nbsp;)' : ''}}</div> -->
            </div>
        </div>
        <div class="report-summary pagebreak">
            <div class="summary-title">
                {{ t('dashboard.body.panel_title.CONTAINER_SEC') }}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.page-cover {
  background-image: url('../../../assets/img/background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  -webkit-print-color-adjust: exact;
  height: 700px;
  position: relative;
  page-break-after: always;

  .page-cover-decro {
    background-image: url('../../../assets/img/abstract.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    -webkit-print-color-adjust: exact;
    height: 500px;
    width: 700px;
    position: absolute;
    left: 30px;
    top: 30px;
    z-index: 10;
  }
  .page-cover-logo {
    background-image: url('../../../assets/img/logo-with-text.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    -webkit-print-color-adjust: exact;
    height: 100px;
    width: 400px;
    position: absolute;
    right: 30px;
    top: 200px;
    z-index: 20;
  }
  .page-cover-title {
    color: #666;
    font-size: 50px;
    position: absolute;
    bottom: 50px;
    width: 100%;
    text-align: center;
  }
}

.pagebreak {
  clear: both;
  page-break-after: always;
}

.report-summary {
  page-break-after: always;
  .summary-title {
    color: #194b20;//$neuvector-dark-green-800;
    font-size: 30px;
    font-weight: bolder;
    margin: 10px 0;
  }
  .summary-subtitle {
    font-size: 20px;
    font-weight: bolder;
  }
  .statistic-row {
    font-size: 20px;
    margin-left: 0;
    margin-right: 0;
  }
  .statistic-row:nth-child(even) {
    background: #94b499; //$neuvector-dark-green-200;
    -webkit-print-color-adjust: exact;
  }
  .statistic-row:nth-child(odd) {
    background: #bfd3c3; //$neuvector-dark-green-100;
    -webkit-print-color-adjust: exact;
  }
  .statistic-cell {
    padding: 5px 15px;
    border: 3px solid #fff;
  }
}

.print-table {
  border: 1px solid #b0c0ce; //$neuvector-grey-400;
  display: table;
  width: 980px;
  page-break-after: auto;
  table-layout: fixed;
}

.print-header {
  background-color: #e9eef2; //$neuvector-grey-100;
  -webkit-print-color-adjust: exact;
}

.print-header,
.print-row {
  border-bottom: 1px solid #b0c0ce; //$neuvector-grey-400;
  font-size: 10px;
  page-break-inside: avoid;
  page-break-after: auto;
  display: table-row;
}
</style>