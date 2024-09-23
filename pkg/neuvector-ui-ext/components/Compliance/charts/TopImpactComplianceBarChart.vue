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

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { complianceImpactComp } from '../../../utils/compliance';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: {
    Bar,
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
    compliances: Array
  },
  computed: {
    top5Compliance() {
      return [...this.compliances].sort(complianceImpactComp).slice(0, 5);
    },
    chartData() {
      return {
        labels: this.top5Compliance.map(c => [c.name]),
        datasets: [
          {
            data: this.top5Compliance.map(c => c.workloads.length),
            label: 'Container',
            backgroundColor: '#4D5360',
            hoverBackgroundColor: '#4D5360',
            barThickness: 12,
            borderWidth: 0,
            barPercentage: 0.04,
          },
          {
            data: this.top5Compliance.map(c => c.nodes.length),
            label: 'Node',
            backgroundColor: '#36A2EB',
            hoverBackgroundColor: '#36A2EB',
            barThickness: 12,
            borderWidth: 0,
            barPercentage: 0.04,
          },
          {
            data: this.top5Compliance.map(c => c.images.length),
            label: 'Image',
            backgroundColor: '#86aec2',
            hoverBackgroundColor: '#86aec2',
            barThickness: 12,
            borderWidth: 0,
            barPercentage: 0.04,
          },
          {
            data: this.top5Compliance.map(c => c.platforms.length),
            label: 'Platform',
            backgroundColor: '#f22d3a',
            hoverBackgroundColor: '#f22d3a',
            barThickness: 12,
            borderWidth: 0,
            barPercentage: 0.04,
          },
        ],
      };
    }
  },
  data() {
    return {
      chartOptions: {
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
          },
          x: {
            stacked: true,
            beginAtZero: true,
          },
        },
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'point',
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 12,
            },
          },
        },
      }
    }
  }
}
</script>

<style lang="scss">
</style>

