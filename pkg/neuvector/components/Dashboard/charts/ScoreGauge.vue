<template>
    <div>
      <p>
        <small
          ><center><span style="color: red">{{ title }}</span> ({{ value }})</center></small
        >
      </p>
      <vue-gauge
        class="text-center"
        refid="score-gauge"
        :options="myOptions"
      />
      <table style=" margin: -20px auto 0 auto;">
        <tr class="text-center dashboard-summary-title">
            <td>{{ t('dashboard.heading.NODES') }}</td>
            <td>{{ t("dashboard.heading.PODS") }}</td>
        </tr>
        <tr class="text-center dashboard-summary-value">
            <td>{{ nodesCnt }}</td>
            <td>{{ podsCnt }}</td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  import VueGauge from "vue-gauge";
  export default {
    components: { VueGauge },
    props: {
      title: String,
      value: String,
      nodesCnt: String,
      podsCnt: String
    },
    data() {
      return {
        myOptions: {
          chartWidth: 150,
          needleValue: this.value,
          needleColor: "white",
          arcDelimiters: [40, 70],
          arcColors: ["rgb(255,84,84)", "rgb(239,214,19)", "rgb(61,204,91)"],
          arcLabels: ["15", "40"],
          rangeLabel: ["0", "100"],
          rangeLabelFontSize: 14,
        },
      };
    }
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .vue-gauge-item > svg > text {
        color: white;
    }
    .dashboard-summary-title {
        line-height: 16px;
        & > td {
            float: left;
            height: 16px;
            width: 50px;
            color: #7e8da2;
            line-height: 16px;
        }
        td:first-child {
            border-right: #7e8da2 1px solid;
        }
        td:last-child {
            border-left: #7e8da2 1px solid;
        }
    }
    .dashboard-summary-value {
        line-height: 16px;
        & > td {
            float: left;
            height: 16px;
            background-color: #7e8da2;
            -webkit-print-color-adjust: exact;
            color: #fff;
            width: 50px;
            line-height: 16px;
        }
        td:first-child {
            border-right: #fff 1px solid;
            border-bottom-left-radius: 2px;
            border-top-left-radius: 2px;
        }
        td:last-child {
            border-left: #fff 1px solid;
            border-bottom-right-radius: 2px;
            border-top-right-radius: 2px;
        }                   
    }
  </style>
  