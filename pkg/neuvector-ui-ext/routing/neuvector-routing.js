import Dashboard from '../pages/c/_cluster/neuvector/index.vue';
import SecurityEvents from '../components/SecurityEvents/SecurityEventsView.vue';

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
];

export default routes;
