<template>
    <Bar
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
      <EmptyDataMessage icon="icon-checkmark" color="#8bc34a" :message="t('dashboard.body.message.NO_SEC_EVENTS')"/>
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs/legacy';
  import EmptyDataMessage from '../contents/EmptyDataMessage';
  
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: {
      Bar,
      EmptyDataMessage
    },
    props: {
      chartId: {
        type: String,
        default: 'bar-chart'
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
      securityEventTop5ByDestination: Array
    },
    computed: {
      chartData: function() {
        let topSecurityEventsLabels = new Array(5);
        let topSecurityEventsData = new Array(5);
        let barChartColors = new Array(5);
        let barChartBorderColors = new Array(5);
        topSecurityEventsLabels.fill('');
        topSecurityEventsData.fill(0);
        barChartColors.fill('rgba(239, 83, 80, 0.3)');
        barChartBorderColors.fill('#ef5350');
        if (this.securityEventTop5ByDestination.length === 0) {
          this.isEmptyData = true;
        } else {
          this.isEmptyData = false;
          this.securityEventTop5ByDestination.forEach((workloadEvents, index) => {
            topSecurityEventsLabels[index] = workloadEvents[0]['destination_workload_name'];
            topSecurityEventsData[index] = workloadEvents.length;
          });
        }
        return {
          labels: topSecurityEventsLabels,
          datasets: [
            {
            label: `${this.t('dashboard.body.panel_title.TOP_SEC_EVENTS')} - ${this.t('dashboard.body.panel_title.DESTINATION')}`,
            data: topSecurityEventsData,
            backgroundColor: barChartColors,
            borderColor: barChartBorderColors,
            hoverBackgroundColor: barChartColors,
            hoverBorderColor: barChartBorderColors,
            barThickness: 15,
            borderWidth: 2
            }
          ],
        };
      }
    },
    data() {
      return {
        chartOptions: {
          animation: false,
          indexAxis: 'y',
          scales: {
            x: {
              ticks: {
                callback: (value) => {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
              beginAtZero: true,
            },
            y: {
              ticks: {
                crossAlign: "far",
                callback: function(value, index, values) {
                  let label = this.getLabelForValue(value);
                  return label.length > 22 ? `${label.substring(0, 22)}...` : label;
                },
              }
            }
          },
          maintainAspectRatio: false
        },
        isEmptyData: false
      }
    }
  }
  </script>
  