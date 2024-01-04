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
          labels: ['emailservice-844bc9d8cb-td97k', 'recommendationservice-557596fdcb-gr7ww', 'loadgenerator-5654bbdb6f-vlg9b', 'frontend-89857c76-ss4hn', 'currencyservice-76d4b755d6-tzvvb'],
          datasets: [
            {
              data: [61, 61, 61, 17, 13],
              label: this.t('enum.HIGH'),
              backgroundColor: 'rgba(239, 83, 80, 0.3)',
              borderColor: '#ef5350',
              hoverBackgroundColor: 'rgba(239, 83, 80, 0.3)',
              hoverBorderColor: '#ef5350',
              barThickness: 15,
              borderWidth: 2,
            },
            {
              data: [66, 66, 65, 12, 16],
              label: this.t('enum.MEDIUM'),
              backgroundColor: 'rgba(255, 152, 0, 0.3)',
              borderColor: '#ff9800',
              hoverBackgroundColor: 'rgba(255, 152, 0, 0.3)',
              hoverBorderColor: '#ff9800',
              barThickness: 15,
              borderWidth: 2,
            },
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
  