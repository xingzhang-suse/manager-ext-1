import Dashboard from '../pages/c/_cluster/neuvector/index.vue';
import SecurityEvents from '../components/SecurityEvents/SecurityEventsView.vue';
import Vulnerabilities from '../components/Vulnerabilities/Vulnerabilities.vue';
import NetworkRules from '../components/NetworkRules/NetworkRules.vue';
import Compliance from '../components/Compliance/Compliance.vue';
import ResponseRules from '../components/ResponseRules/ResponseRules';
import NetworkActivities from '../components/NetworkActivities/NetworkActivities';
import Topology from '../components/Topology/Topology';

const NEUVECTOR = 'neuvector';

const routes = [
  {
    name:      `c-cluster-${ NEUVECTOR }-dashboard`,
    path:      `/c/:cluster/${ NEUVECTOR }/dashboard`,
    component: Dashboard,
  },
  {
    name:       `c-cluster-${ NEUVECTOR }-sec-events`,
    path:       `/c/:cluster/${ NEUVECTOR }/sec-events`,
    component:  SecurityEvents,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-scan`,
    path: `/c/:cluster/${ NEUVECTOR }/scan`,
    component: Vulnerabilities,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-bench`,
    path: `/c/:cluster/${ NEUVECTOR }/bench`,
    component: Compliance,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-policy`,
    path: `/c/:cluster/${ NEUVECTOR }/policy`,
    component: NetworkRules,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-response-rules`,
    path: `/c/:cluster/${ NEUVECTOR }/response-rules`,
    component: ResponseRules,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-network-activities`,
    path: `/c/:cluster/${ NEUVECTOR }/network-activities`,
    component: NetworkActivities,
  },
  {
    name: `c-cluster-${ NEUVECTOR }-topology`,
    path: `/c/:cluster/${ NEUVECTOR }/topology`,
    component: Topology,
  },
];

export default routes;
