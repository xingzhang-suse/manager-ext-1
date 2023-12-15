<script>
import { mapGetters } from 'vuex';
import Loading from '@shell/components/Loading';
import BarChart from './charts/BarChart';
import BarChart2 from './charts/BarChart2';
import SampleGrid from './grids/SampleGrid';
import ScoreGauge from './charts/ScoreGauge';

export default {
  components: {
    Loading, BarChart, BarChart2, SampleGrid, ScoreGauge
  },

  mixins: [],

  async fetch() {
    
  },

  // data() {
   
  // },

  computed: {
    
  },

  methods: {
  
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else class="dashboard">
    <div>
      <div class="head-title">
        <h1 data-testid="nv-dashboard-title" class="mb-20">
          Dashboard
        </h1>
        <!-- <span v-if="version">{{ version }}</span> -->
      </div>
      <div class="get-started">
        <div class="head card-container p-20">
          <div class="text-center">Top Vulnerable Containers</div>
          <BarChart />
        </div>
        <div class="head card-container p-20">
          <div class="text-center">Top Vulnerable Hosts</div>
          <BarChart2 />
        </div>
      </div>
      <div class="head card-container p-20">
          <div>Ingress and Egress Exposure</div>
          <SampleGrid />
        </div>
      <!-- <ScoreGauge /> -->
      <div class="head-links">
        <a
          href="https://www.neuvector.com/"
          target="_blank"
          rel="neuvector portal"
        >
          NeuVector
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;

  .head {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: $space-m;
    outline: 1px solid var(--border);
    border-radius: var(--border-radius);
    margin: 0 0 64px 0;
    padding: $space-m;
    gap: $space-m;

    &-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;

      h1 {
        margin: 0;
      }

      span {
        background: var(--primary);
        border-radius: var(--border-radius);
        padding: 4px 8px;
      }
    }

    &-subheader {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    &-links {
      display: flex;
      gap: 10px;
    }
  }

  .get-started {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;

    .card-container {
      min-height: 420px;
      padding: 0;
    }
  }
}
.container {
  & .title {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 100px 0;
  }

  & .description {
    line-height: 20px;
  }

  & .chart-route {
    position: relative;
  }

  & .airgap-align {
    justify-content: start;
  }
}
</style>
