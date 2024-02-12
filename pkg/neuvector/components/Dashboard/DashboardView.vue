<script>
import Loading from '@shell/components/Loading';
import BarChart4TopVulnerableContainers from './charts/BarChart4TopVulnerableContainers';
import BarChart4TopVulnerableHosts from './charts/BarChart4TopVulnerableHosts';
import LineChart4SecurityEvents from './charts/LineChart4SecurityEvents';
import BarChart4TopSecurityEventsBySource from './charts/BarChart4TopSecurityEventsBySource';
import BarChart4TopSecurityEventsByDestination from './charts/BarChart4TopSecurityEventsByDestination';
import PieChart4PolicyModeOfPods from './charts/PieChart4PolicyModeOfPods';
import PieChart4PolicyModeOfServices from './charts/PieChart4PolicyModeOfServices';
import PolicyModeOfServices from './contents/PolicyModeOfServices';
import PolicyModeOfPods from './contents/PolicyModeOfPods';
import BarChart4Exposures from './charts/BarChart4Exposures';
import ScoreFactor from './contents/ScoreFactor';
import ExposureGrid from './grids/ExposureGrid';
import Instruction from './contents/Instruction';
import ScoreFactorCommentSlider from './contents/ScoreFactorCommentSlider';
import ScoreGauge from './charts/ScoreGauge';
import axios from 'axios';
import Exposures from './panels/Exposures';

export default {
  components: {
    Loading,
    BarChart4TopVulnerableContainers,
    BarChart4TopVulnerableHosts,
    LineChart4SecurityEvents,
    BarChart4TopSecurityEventsBySource,
    BarChart4TopSecurityEventsByDestination,
    PieChart4PolicyModeOfPods,
    PieChart4PolicyModeOfServices,
    PolicyModeOfServices,
    PolicyModeOfPods,
    BarChart4Exposures,
    ScoreFactor,
    ExposureGrid,
    ScoreGauge,
    Instruction,
    ScoreFactorCommentSlider,
    Exposures
  },

  mixins: [],

  async fetch() {
    this.scoreInfo = null;
    this.notificationInfo = null;
    this.detailsInfo = null;
    axios({
      url: `../../api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/auth`,
      method: 'post',
      data: {
        username: '',
        password: '',
        isRancherSSOUrl: true
      }
    }).then(res => {
      console.log(res);
      this.token = res.data.token.token;
      this.isAuthErr = false;
      axios({
        url: `../../api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/dashboard/scores2`,
        method: 'get',
        params: {
          isGlobalUser: true,
          domain: 'null'
        },
        headers: {
          token: res.data.token.token
        }
      }).then(res => {
        this.scoreInfo = res.data;
      });
      axios({
        url: `../../api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/dashboard/notifications2`,
        method: 'get',
        headers: {
          token: res.data.token.token
        }
      }).then(res => {
        this.notificationInfo = res.data;
      });
      axios({
        url: `../../api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/dashboard/details`,
        method: 'get',
        headers: {
          token: res.data.token.token
        }
      }).then(res => {
        this.detailsInfo = res.data;
      });
    })
    .catch(err => {
      console.log(err);
      this.isAuthErr = true;
    });
  },

  data() {
    return  {
      scoreInfo: null,
      notificationInfo: null,
      detailsInfo: null,
      isAuthErr: false,
      token: null
    }
  },

  props: {
    ns: String
  },

  computed: {
    getServiceConnRisk: function() {
      return {
        title: this.t('dashboard.heading.SERVICE_CONN'),
        factors: [
          {
            category: this.t('enum.DISCOVER'),
            amount: this.scoreInfo.header_data.groups.discover_groups,
            comment: this.scoreInfo.header_data.groups.discover_groups_zero_drift
          },
          {
            category: this.t('enum.MONITOR'),
            amount: this.scoreInfo.header_data.groups.monitor_groups,
            comment: this.scoreInfo.header_data.groups.monitor_groups_zero_drift
          },
          {
            category: this.t('enum.PROTECT'),
            amount: this.scoreInfo.header_data.groups.protect_groups,
            comment: this.scoreInfo.header_data.groups.protect_groups_zero_drift
          },
        ],
        subScore: 'height: 33%',
        isFactorError: false,
      }
    },
    getExposureRisk: function() {
      return {
        title: this.t('dashboard.heading.INGRESS_EGRESS'),
        factors: [
          {
            category: this.t('enum.DISCOVER'),
            amount: this.scoreInfo.header_data.workloads.discover_ext_eps
          },
          {
            category: this.t('dashboard.heading.THREATS'),
            amount: this.scoreInfo.header_data.workloads.threat_ext_eps
          },
          {
            category: this.t('dashboard.heading.VIOLATIONS'),
            amount: this.scoreInfo.header_data.workloads.violate_ext_eps
          },
        ],
        subScore: 'height: 81%',
        isFactorError: false,
      }
    },
    getVulnerabilityRisk: function() {
      return {
        title: this.t('dashboard.heading.VUL_EXPLOIT'),
        factors: [
          {
            category: this.t('enum.DISCOVER'),
            amount: this.scoreInfo.header_data.cves.discover_cves
          },
          {
            category: this.t('enum.MONITOR'),
            amount: this.scoreInfo.header_data.cves.monitor_cves
          },
          {
            category: this.t('enum.PROTECT'),
            amount: this.scoreInfo.header_data.cves.protect_cves
          },
        ],
        factorComment: [
          `${this.t('dashboard.heading.CVE_DB_VERSION')}: 3.292`,
          '(Dec 19, 2023)'
        ],
        subScore: 'height: 11%',
        isFactorError: false,
      }
    },
    getInstructions4Exposures: function() {
      return {
        textLines: [
          this.t('dashboard.help.exposure.txt1'),
          this.t('dashboard.help.exposure.txt2')
        ]
      };
    },
    getInstructions4SecurityEvents: function() {
      return {
        textLines: [
          this.t('dashboard.help.criticalEvent.txt1'),
          this.t('dashboard.help.criticalEvent.txt2')
        ]
      };
    },
    getInstructions4TopSecurityEventsInSource: function() {
      return {
        textLines: [
          this.t('dashboard.help.top_security_events.txt1'),
          this.t('dashboard.help.top_security_events.txt2'),
          this.t('dashboard.help.top_security_events.txt2_1'),
          this.t('dashboard.help.top_security_events.txt2_2'),
          this.t('dashboard.help.top_security_events.txt2_3')
        ]
      };
    },
    getInstructions4TopSecurityEventsInDestination: function() {
      return {
        textLines: [
          this.t('dashboard.help.top_security_events.txt3'),
          this.t('dashboard.help.top_security_events.txt4'),
          this.t('dashboard.help.top_security_events.txt4_1'),
          this.t('dashboard.help.top_security_events.txt4_2'),
          this.t('dashboard.help.top_security_events.txt4_3')
        ]
      };
    },
    getInstructions4TopVulnerablePods: function() {
      return {
        textLines: [
          this.t('dashboard.help.top_vulnerable_pod.txt1'),
          this.t('dashboard.help.top_vulnerable_pod.txt2')
        ]
      };
    },
    getInstructions4TopVulnerableNodes: function() {
      return {
        textLines: [
          this.t('dashboard.help.top_vulnerable_node.txt1'),
          this.t('dashboard.help.top_vulnerable_node.txt2')
        ]
      };
    },
    getInstructions4PodsMode: function() {
      return {
        textLines: [
          this.t('dashboard.help.policy_mode_pod.txt1'),
          this.t('dashboard.help.policy_mode_pod.txt2')
        ]
      };
    }
  },

  methods: {
  
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else-if="isAuthErr">Authentication Error!</div>
  <div v-else class="dashboard">
    <div>
      <div class="head-title">
        <h1 data-testid="nv-dashboard-title" class="mb-20">
          {{ t('dashboard.TITLE') }}
        </h1>
        <!-- <span v-if="version">{{ version }}</span> -->
      </div>
      <div class="card-container head">
        <div class="get-started " v-if="scoreInfo">
          <ScoreGauge :scoreInfo="scoreInfo"/>
          <ScoreFactor
            :riskFactor="getServiceConnRisk"
          />
          <ScoreFactor
            :riskFactor="getExposureRisk"
          />
          <ScoreFactor
            :riskFactor="getVulnerabilityRisk"
          />
          <ScoreFactorCommentSlider class="m-0"/>
        </div>

      </div>
      <div class="head card-container p-20">
        <div class="get-started">
          <div>{{ t('dashboard.body.panel_title.CONTAINER_SEC') }}</div>
          <Instruction
            :instructions="getInstructions4Exposures"
          />
        </div>
        <div v-if="scoreInfo">
          <Exposures :ingress="scoreInfo.ingress" :egress="scoreInfo.egress" :token="token" :ns="ns"/>
        </div>
      </div>
      <div class="head card-container p-20">
        <div class="get-started">
          <div>{{ t('dashboard.heading.CRITICAL_SECURITY_EVENT') }}</div>
          <Instruction
            :instructions="getInstructions4SecurityEvents"
          />
        </div>
        <LineChart4SecurityEvents v-if="notificationInfo" :securityEventSummaryInfo="notificationInfo.criticalSecurityEvents.summary"/>
      </div>
      <div class="get-started">
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.TOP_SEC_EVENTS') }} - {{ t('dashboard.body.panel_title.SOURCE') }}</div>
            <Instruction
              :instructions="getInstructions4TopSecurityEventsInSource"
            />
          </div>
          <BarChart4TopSecurityEventsBySource v-if="notificationInfo" :securityEventTop5BySource="notificationInfo.criticalSecurityEvents.top_security_events.source"/>
        </div>
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.TOP_SEC_EVENTS') }} - {{ t('dashboard.body.panel_title.DESTINATION') }}</div>
            <Instruction
              :instructions="getInstructions4TopSecurityEventsInDestination"
            />
          </div>
          <BarChart4TopSecurityEventsByDestination v-if="notificationInfo" :securityEventTop5ByDestination="notificationInfo.criticalSecurityEvents.top_security_events.destination"/>
        </div>
      </div>
      <div class="get-started">
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.TOP_VULNERABLE_CONTAINERS') }}</div>
            <Instruction
              :instructions="getInstructions4TopVulnerablePods"
            />
          </div>
          <BarChart4TopVulnerableContainers v-if="detailsInfo" :topVulContainers="detailsInfo.highPriorityVulnerabilities.containers"/>
        </div>
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.TOP_VULNERABLE_NODES') }}</div>
            <Instruction
              :instructions="getInstructions4TopVulnerableNodes"
            />
          </div>
          <BarChart4TopVulnerableHosts v-if="detailsInfo" :topVulHosts="detailsInfo.highPriorityVulnerabilities.nodes"/>
        </div>
      </div>
      <div class="get-started">
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.CONTAINER_MODE') }}</div>
            <Instruction
              :instructions="getInstructions4PodsMode"
            />
          </div>
          <PieChart4PolicyModeOfPods v-if="detailsInfo" :podMode="detailsInfo.containers"/>
          <PolicyModeOfPods />
        </div>
        <div class="head card-container p-20">
          <div class="get-started">
            <div>{{ t('dashboard.body.panel_title.SERVICE_MODE') }}</div>
            <Instruction
              :instructions="getInstructions4PodsMode"
            />
          </div>
          <PieChart4PolicyModeOfServices v-if="detailsInfo && scoreInfo" :serviceMode="detailsInfo.services" :groupInfo="scoreInfo.header_data.groups"/>
          <PolicyModeOfServices />
        </div>
      </div>
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
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
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

.pull-right {
  float: right !important;
}
</style>
