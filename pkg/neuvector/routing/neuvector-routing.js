import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';
import Dashboard from '../pages/c/_cluster/neuvector/index.vue';

const BLANK_CLUSTER = '_';
const NEUVECTOR = 'NeuVector1';
const NEUVECTOR_DASHBOARD = 'Dashboard';

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
