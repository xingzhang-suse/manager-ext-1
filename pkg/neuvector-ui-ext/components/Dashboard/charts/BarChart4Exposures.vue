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
  import { Bar } from 'vue-chartjs/legacy';
  import { NV_CONST } from '../../../types/neuvector';
  
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
        default: 300
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
      hierarchicalIngressList: Array,
      hierarchicalEgressList: Array
    },
    computed: {
      chartData: function() {
        console.log("this.hierarchicalEgressList", this.hierarchicalEgressList, this.hierarchicalIngressList)
        let egressContainers = this.hierarchicalEgressList.flatMap(service => {
          return service.children;
        });
        let ingressContainers = this.hierarchicalIngressList.flatMap(service => {
          return service.children;
        });
        let chartNumbers = {
          ingress: new Map([
            [NV_CONST.POLICY_ACTION.ALLOW, 0],
            [NV_CONST.POLICY_ACTION.DENY, 0],
            [NV_CONST.POLICY_ACTION.VIOLATE, 0],
            [NV_CONST.POLICY_ACTION.THREAT, 0]
          ]),
          egress: new Map([
            [NV_CONST.POLICY_ACTION.ALLOW, 0],
            [NV_CONST.POLICY_ACTION.DENY, 0],
            [NV_CONST.POLICY_ACTION.VIOLATE, 0],
            [NV_CONST.POLICY_ACTION.THREAT, 0]
          ])
        };
        this.accumulateData(ingressContainers, chartNumbers, NV_CONST.INGRESS);
        this.accumulateData(egressContainers, chartNumbers, NV_CONST.EGRESS);
        return {
          labels: [
            this.t('dashboard.body.panel_title.ALLOW'),
            this.t('dashboard.body.panel_title.DENY'),
            this.t('dashboard.body.panel_title.ALERT'),
            this.t('dashboard.body.panel_title.THREAT')
          ],
          datasets: [
            {
              data: Array.from(chartNumbers.ingress.values()),
              label: this.t('dashboard.body.panel_title.INGRESS_CONTAINERS'),
              backgroundColor: 'rgba(255, 13, 129, 0.2)',
              borderColor: '#ff0d81',
              hoverBackgroundColor: 'rgba(255, 13, 129, 0.2)',
              hoverBorderColor: '#ff0d81',
              borderWidth: 2,
            },
            {
              data: Array.from(chartNumbers.egress.values()),
              label: this.t('dashboard.body.panel_title.EGRESS_CONTAINERS'),
              backgroundColor: 'rgba(255, 113, 1, 0.2)',
              borderColor: '#ff7101',
              hoverBackgroundColor: 'rgba(255, 113, 1, 0.2)',
              hoverBorderColor: '#ff7101',
              borderWidth: 2,
            }
          ]
        };
      }
    },
    methods: {
      accumulateData: function(exposedContainers, chartNumbers, direction) {
        exposedContainers.forEach(exposedContainer => {
          if (exposedContainer.severity) {
            chartNumbers[direction].set(NV_CONST.POLICY_ACTION.THREAT, chartNumbers[direction].get(NV_CONST.POLICY_ACTION.THREAT) + 1);
          } else {
            let policyAction = exposedContainer.policy_action.toLowerCase();
            chartNumbers[direction].set(policyAction, chartNumbers[direction].get(policyAction) + 1);
          }
        });
      }
    },
    data() {
      return {
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
  