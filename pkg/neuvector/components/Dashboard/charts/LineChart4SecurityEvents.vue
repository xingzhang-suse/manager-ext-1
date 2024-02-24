<template>
  <LineChartGenerator
    v-if="!isEmptyData"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
  <div class="message-content" v-else>
    <EmptyDataMessage icon="icon-checkmark" color="#8bc34a" :message="t('dashboard.body.message.NO_CRITICAL_SECURITY_EVENT')"/>
  </div>
</template>
  
  <script>
  import { Line as LineChartGenerator } from 'vue-chartjs/legacy';
  import EmptyDataMessage from '../contents/EmptyDataMessage';
  
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
  } from 'chart.js'
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
  )
  
  export default {
    name: 'lineChart',
    components: {
      LineChartGenerator,
      EmptyDataMessage
    },
    props: {
      chartId: {
        type: String,
        default: 'line-chart'
      },
      datasetIdKey: {
        type: String,
        default: 'label'
      },
      width: {
        type: Number,
        default: 400
      },
      height: {
        type: Number,
        default: 180
      },
      cssClasses: {
        default: '',
        type: String
      },
      styles: {
        type: Object,
        default: () => {}
      },
      plugins: {
        type: Array,
        default: () => {}
      },
      securityEventSummaryInfo: Object
    },
    computed: {
      chartData: function() {
        let securityEventsLabels = new Set();
        this.securityEventSummaryInfo.critical.forEach((critical) => {
          securityEventsLabels.add(critical[0]);
        });
        this.securityEventSummaryInfo.warning.forEach((warning) => {
          securityEventsLabels.add(warning[0]);
        });
        securityEventsLabels = Array.from(securityEventsLabels).sort((a, b) => a - b);

        let labelListLength = securityEventsLabels.length;
        let criticalTotal = 0;
        let warningTotal = 0
        let criticalDataList = new Array(labelListLength);
        let warningDataList = new Array(labelListLength);
        if (this.securityEventSummaryInfo.critical.length === 0 && this.securityEventSummaryInfo.warning.length === 0) {
          this.isEmptyData = true;
        } else {
          this.isEmptyData = false;
          this.securityEventSummaryInfo.critical.forEach((critical) => {
            let index = securityEventsLabels.findIndex(label => label === critical[0]);
            criticalDataList[index] = critical[1];
            criticalTotal += critical[1];
          });
          this.securityEventSummaryInfo.warning.forEach((warning) => {
            let index = securityEventsLabels.findIndex(label => label === warning[0]);
            warningDataList[index] = warning[1];
            warningTotal += warning[1];
          });
        }
        return {
          labels: securityEventsLabels,
          datasets: [
            {
                label: `${this.t('enum.CRITICAL')}: ${criticalTotal}`,
                data: criticalDataList,
                backgroundColor: 'rgba(239, 83, 80, 0.3)',
                borderColor: '#ef5350',
                hoverBackgroundColor: 'rgba(239, 83, 80, 0.3)',
                hoverBorderColor: '#ef5350',
                pointColor: '#ef5350',
                pointStrokeColor: '#ef5350',
                pointHighlightFill: '#ef5350',
                pointHighlightStroke: '#ef5350',
                tension: 0.2,
            },
            {
                label: `${this.t('enum.WARNING')}: ${warningTotal}`,
                data: warningDataList,
                backgroundColor: 'rgba(239, 83, 80, 0.3)',
                borderColor: '#ff9800',
                hoverBackgroundColor: 'rgba(239, 83, 80, 0.3)',
                hoverBorderColor: '#ff9800',
                pointColor: '#ff9800',
                pointStrokeColor: '#ff9800',
                pointHighlightFill: '#ff9800',
                pointHighlightStroke: '#ff9800',
                tension: 0.2,
            }
          ],
        };
      }
    },
    data() {
      return {
        chartOptions: {
          animation: false,
          scales: {
            y: {
                ticks: {
                callback: (value) => {
                    if (parseFloat(value) % 1 === 0) return value;
                    return null;
                }
                }
            },
          },
          plugins: {
            legend: {
                position: 'right',
                labels: {
                boxWidth: 15,
                boxHeight: 15
                }
            },
            title: {
                display: true,
                text: this.t('dashboard.body.panel_title.SEC_EVENTS')
            }
          },
          maintainAspectRatio: false
        },
        isEmptyData: false
      }
    }
  }
  </script>
  