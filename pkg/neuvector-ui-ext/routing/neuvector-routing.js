import Dashboard from '../pages/c/_cluster/neuvector/index.vue';
import SecurityEvents from '../components/SecurityEvents/SecurityEventsView.vue';
import Vulnerabilities from '../components/Vulnerabilities/Vulnerabilities.vue';
import NetworkRules from '../components/NetworkRules/NetworkRules.vue';
import Compliance from '../components/Compliance/Compliance.vue';

const NEUVECTOR = 'neuvector';

const routes = [
  {
    name:      `c-cluster-${ NEUVECTOR }`,
    path:      `/c/:cluster/${ NEUVECTOR }`,
    component: Dashboard,
    meta:      {
      product: NEUVECTOR,
      pkg:     NEUVECTOR
    }
  },
  {
    name:       `c-cluster-${ NEUVECTOR }-sec-events`,
    path:       `/c/:cluster/${ NEUVECTOR }/sec-events`,
    component:  SecurityEvents,
    meta:       {
      product: NEUVECTOR,
      pkg: NEUVECTOR
    }
  },
  {
    name: `c-cluster-${ NEUVECTOR }-scan`,
    path: `/c/:cluster/${ NEUVECTOR }/scan`,
    component: Vulnerabilities,
    meta:       {
      product: NEUVECTOR,
      pkg: NEUVECTOR
    }
  },
  {
    name: `c-cluster-${ NEUVECTOR }-bench`,
    path: `/c/:cluster/${ NEUVECTOR }/bench`,
    component: Compliance,
    meta:       {
      product: NEUVECTOR,
      pkg: NEUVECTOR
    }
  },
  {
    name: `c-cluster-${ NEUVECTOR }-policy`,
    path: `/c/:cluster/${ NEUVECTOR }/policy`,
    component: NetworkRules,
    meta:       {
      product: NEUVECTOR,
      pkg: NEUVECTOR
    }
  }
];

export default routes;
