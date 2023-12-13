<script>
import { mapGetters } from 'vuex';
import Loading from '@shell/components/Loading';
import BarChart from './charts/BarChart';
import SampleGrid from './grids/SampleGrid';
import ScoreGauge from './charts/ScoreGauge';

export default {
  components: {
    Loading, BarChart, SampleGrid, ScoreGauge
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
    <div class="head">
      <div class="head-title">
        <h1 data-testid="nv-dashboard-title">
          Dashboard
        </h1>
        <!-- <span v-if="version">{{ version }}</span> -->
      </div>
      <BarChart />
      <SampleGrid />
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
</style>
