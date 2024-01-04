<template>
    <Bar
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
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs/legacy'
  
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
      Bar
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
        default: 400
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
      }
    },
    data() {
      return {
        chartData: {
          labels: ['Allow', 'Deny', 'Alert', 'Threat'],
          datasets: [
            {
                data: [0,0,0,0],
                label: this.t('dashboard.body.panel_title.INGRESS_CONTAINERS'),
                backgroundColor: 'rgba(255, 13, 129, 0.2)',
                borderColor: '#ff0d81',
                hoverBackgroundColor: 'rgba(255, 13, 129, 0.2)',
                hoverBorderColor: '#ff0d81',
                borderWidth: 2,
            },
            {
                data: [3,0,0,0],
                label: this.t('dashboard.body.panel_title.EGRESS_CONTAINERS'),
                backgroundColor: 'rgba(255, 113, 1, 0.2)',
                borderColor: '#ff7101',
                hoverBackgroundColor: 'rgba(255, 113, 1, 0.2)',
                hoverBorderColor: '#ff7101',
                borderWidth: 2,
            },
          ],
        },
        chartOptions: {
          animation: false,
          indexAxis: 'x',
          scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                ticks: {
                    callback: (value) => {
                        if (parseFloat(value) % 1 === 0) return value;
                        return null;
                    }
                }
            },
            },
            elements: {
            bar: {
                borderWidth: 4,
            },
          },
          plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                boxWidth: 15,
                boxHeight: 15
                }
            },
            title: {
                display: true,
                text: this.t('dashboard.body.panel_title.EXPOSURES'),
            },
          },
          maintainAspectRatio: false
        }
      }
    }
  }
  </script>
  