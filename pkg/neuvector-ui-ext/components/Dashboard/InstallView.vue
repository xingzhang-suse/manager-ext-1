<script>
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';

import { CATALOG, SERVICE } from '@shell/config/types';
import { REPO_TYPE, REPO, CHART, VERSION } from '@shell/config/query-params';
import { allHash } from '@shell/utils/promise';
import ResourceFetch from '@shell/mixins/resource-fetch';

import { Banner } from '@components/Banner';
import Loading from '@shell/components/Loading';

import { NEUVECTOR_CHARTS } from '../../types';
import { getLatestStableVersion } from '../../plugins/neuvector-class';
import { handleGrowl } from '../../utils/handle-growl';
import { refreshCharts } from '../../utils/chart';

export default {
  props: {
    uiService: {
      type:     Object,
      default:  () => {}
    }
  },

  components: {
    Banner,
    Loading
  },

  mixins: [ResourceFetch],

  async fetch() {
    if ( !this.uiService ) {
      this.debouncedRefreshCharts = debounce((init = false) => {
        refreshCharts({
          store: this.$store, chartName: NEUVECTOR_CHARTS.CONTROLLER, init
        });
      }, 500);

      this.reloadReady = false;

      await this.$fetchType(CATALOG.CLUSTER_REPO);

      if ( !this.neuvectorRepo || !this.controllerChart ) {
        this.debouncedRefreshCharts(true);
      }
    }
  },

  data() {
   return {
    debounceRefreshCharts: null,
    reloadReady: false,
    install: false,
   }
  },

  computed: {
    ...mapGetters(['currentCluster']),
    ...mapGetters({
      charts: 'catalog/charts', repos: 'catalog/repos', t: 'i18n/t'
    }),

    controllerChart() {
      if ( this.neuvectorRepo ) {
        return this.$store.getters['catalog/chart']({
          repoName:  this.neuvectorRepo.id,
          repoType:  'cluster',
          chartName: NEUVECTOR_CHARTS.CONTROLLER
        });
      }

      return null;
    },

    neuvectorRepo() {
      const chart = this.charts?.find(chart => chart.chartName === NEUVECTOR_CHARTS.CONTROLLER);

      return this.repos?.find(repo => repo.id === chart?.repoName);
    },
  },

  methods: {
    chartRoute() {
      if ( !this.controllerChart ) {
        try {
          this.debouncedRefreshCharts();
        } catch (e) {
          handleGrowl({ error: e, store: this.$store });

          return;
        }
      }

      const {
        repoType, repoName, chartName, versions
      } = this.controllerChart;
      const latestStableVersion = getLatestStableVersion(versions);

      if ( latestStableVersion ) {
        const query = {
          [REPO_TYPE]: repoType,
          [REPO]:      repoName,
          [CHART]:     chartName,
          [VERSION]:   latestStableVersion.version
        };

        this.$router.push({
          name:   'c-cluster-apps-charts-install',
          params: { cluster: this.currentCluster?.id || '_' },
          query,
        });
      } else {
        const error = {
          _statusText: this.t('neuvector.dashboard.appInstall.versionError.title'),
          message:     this.t('neuvector.dashboard.appInstall.versionError.message')
        };

        handleGrowl({ error, store: this.$store });
      }
    }
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else class="container">
    <div v-if="!install" class="title p-10">
      <div class="logo mt-20 mb-10">
        <img
          src="../../assets/neuvector-logo.svg"
          height="64"
        />
      </div>
      <h1 class="mb-20" data-testid="nv-install-title">
        {{ t("neuvector.title") }}
      </h1>
      <div class="description">
        {{ t("neuvector.dashboard.description") }}
      </div>
      <div class="chart-route" v-if="!uiService">
        <Loading v-if="!controllerChart && !reloadReady" mode="relative" class="mt-20" />
        <template v-else-if="!controllerChart && reloadReady">
          <Banner color="warning">
            <span class="mb-20">
              {{ t('neuvector.dashboard.appInstall.reload' ) }}
            </span>
            <button class="ml-10 btn btn-sm role-primary" @click="reload()">
              {{ t('generic.reload') }}
            </button>
          </Banner>
        </template>
        <template v-else>
          <button class="btn role-primary mt-20" data-testid="nv-app-install-button" :disabled="!controllerChart" @click.prevent="chartRoute">
            {{ t("neuvector.dashboard.appInstall.button") }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
