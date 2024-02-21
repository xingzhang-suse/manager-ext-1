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
    <EmptyDataMessage icon="icon-checkmark" color="#8bc34a" :message="t('dashboard.body.message.NO_VULNERABLE_CONTAINER')"/>
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
        default: 200
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
      topVulContainers: Object
    },
    computed: {
      chartData: function() {
        let topVulnerableAssetsLabel = new Array(5);
        let topHighVulnerableAssetsData = new Array(5);
        let topMediumVulnerableAssetsData = new Array(5);
        topVulnerableAssetsLabel.fill('');
        topHighVulnerableAssetsData.fill(0);
        topMediumVulnerableAssetsData.fill(0);
        if (this.topVulContainers.top5Containers.length === 0) {
          this.isEmptyData = true;
        } else {
          this.isEmptyData = false;
          this.topVulContainers.top5Containers.forEach((asset, index) => {
            topVulnerableAssetsLabel[index] = asset.display_name;
            topHighVulnerableAssetsData[index] = asset.high4Dashboard;
            topMediumVulnerableAssetsData[index] = asset.medium4Dashboard;
          });
        }
        
        return {
          labels: topVulnerableAssetsLabel,
          datasets: [
            {
              data: topHighVulnerableAssetsData,
              label: this.t('enum.HIGH'),
              backgroundColor: 'rgba(239, 83, 80, 0.3)',
              borderColor: '#ef5350',
              hoverBackgroundColor: 'rgba(239, 83, 80, 0.3)',
              hoverBorderColor: '#ef5350',
              barThickness: 8,
              borderWidth: 2,
            },
            {
              data: topMediumVulnerableAssetsData,
              label: this.t('enum.MEDIUM'),
              backgroundColor: 'rgba(255, 152, 0, 0.3)',
              borderColor: '#ff9800',
              hoverBackgroundColor: 'rgba(255, 152, 0, 0.3)',
              hoverBorderColor: '#ff9800',
              barThickness: 8,
              borderWidth: 2,
            },
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


<style lang="scss">
.message-content {
    height: 100%;
    align-content: center;
    display: grid;
    text-align: center;
}
</style>
  