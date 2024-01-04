<template>
    <LineChartGenerator
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
  import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
  
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
    name: 'BarChart',
    components: {
      LineChartGenerator
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
          labels: ['2023-05-16', '2023-06-07', '2023-06-12', '2023-06-15', '2023-06-16', '2023-06-20', '2023-06-23', '2023-06-24', '2023-07-03', '2023-08-07', '2023-08-31', '2023-09-05', '2023-09-21', '2023-09-23', '2023-10-06', '2023-10-19', '2023-10-26', '2023-11-02', '2023-11-21', '2023-11-22', '2023-11-28', '2023-12-05', '2023-12-07', '2023-12-08', '2023-12-14'],
          datasets: [
            {
                label: `${this.t('enum.CRITICAL')}: 7`,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
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
                label: `${this.t('enum.WARNING')}: 57`,
                data: [2, 1, 6, 1, 9, 4, 2, 2, 1, 1, 0, 0, 3, 1, 0, 0, 1, 0, 1, 0, 2, 3, 2, 14, 1],
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
        },
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
        }
      }
    }
  }
  </script>
  