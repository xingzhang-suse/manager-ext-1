<template>
    <Pie
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
      <EmptyDataMessage icon="icon-warning" color="#FBC02D" :message="t('dashboard.body.message.NO_MANAGED_CONTAINERS')"/>
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs/legacy';
  import EmptyDataMessage from '../contents/EmptyDataMessage';
  import { NV_CONST } from '../../../types/neuvector';
  
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)
  
  export default {
    name: 'PieChart',
    components: {
        Pie,
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
      podMode: Array
    },
    computed: {
      chartData: function() {
        const modes = NV_CONST.MODES.reverse().concat(['quarantined']);
        let assetsPolicyModeLabels = new Array(modes.length);
        let assetsPolicyModeData = new Array(modes.length);
        assetsPolicyModeLabels = modes.map((mode) => {
          return this.t(`enum.${mode.toUpperCase()}`);
        });
        let containerStateCount = {
          protect: 0,
          monitor: 0,
          discover: 0,
          quarantined: 0
        };
        if (this.podMode.length === 0) {
          this.isEmptyData = true;
        } else {
          this.isEmptyData = false;
          this.podMode.forEach(container => {
            containerStateCount[container.state.toLowerCase()] ++;
          });
        }
        assetsPolicyModeData = Object.values(containerStateCount);
        return {
          labels: assetsPolicyModeLabels,
          datasets: [
            {
              backgroundColor: ['rgba(24, 109, 51, 0.3)', 'rgba(78, 57, 193, 0.3)', 'rgba(33, 150, 243, 0.3)', 'rgba(233, 30, 99, 0.3)'],
              borderColor: ['#186d33', '#4E39C1', '#2196F3', '#E91E63'],
              hoverBackgroundColor: ['rgba(24, 109, 51, 0.3)', 'rgba(78, 57, 193, 0.3)','rgba(33, 150, 243, 0.3)', 'rgba(233, 30, 99, 0.3)'],
              hoverBorderColor: ['#186d33', '#4E39C1', '#2196F3', '#E91E63'],
              borderWidth: 2,
              data: assetsPolicyModeData,
            },
          ],
        };
      }
    },
    data() {
      return {
        chartOptions: {
          animation: false,
          plugins: {
            title: {
                display: false,
                text: this.t('dashboard.body.panel_title.CONTAINER_MODE'),
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                boxWidth: 15,
                boxHeight: 15
                }
            },
          },
          maintainAspectRatio: false
        },
        isEmptyData: false
      }
    }
  }
  </script>
  