import Dashboard from '../pages/c/_cluster/neuvector/index.vue';

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
  }
];

export default routes;
