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
          labels: ['Host: master', 've', '10.1.10.43', '782f087b36421fb3118f2925c8879c1edaf14ec9b38d166ca89a2e07ca2744d6', '10.1.7.11'],
          datasets: [
            {
            label: this.t('dashboard.body.panel_title.DESTINATION'),
            data:  [33, 22, 4, 4, 4],
            backgroundColor:  ['rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)'],
            borderColor: ['#ef5350', '#ef5350', '#ef5350', '#ef5350', '#ef5350'] ,
            hoverBackgroundColor: ['rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.3)'],
            hoverBorderColor: ['#ef5350', '#ef5350', '#ef5350', '#ef5350', '#ef5350'] ,
            barThickness: 15,
            borderWidth: 2
            }
          ],
        },
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
        }
      }
    }
  }
  </script>
  