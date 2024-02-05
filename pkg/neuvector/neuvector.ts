import { IPlugin } from '@shell/core/types';

export function init($plugin: any, store: any) {
  const NEUVECTOR = 'NeuVector';
  const NEUVECTOR_URL = 'NeuVector_Dashboard';
  const NEUVECTOR_DASHBOARD = 'Dashboard';
  const BLANK_CLUSTER = '_';

  const opts = {
    name:        'neuvector',
    ifHaveGroup: '',
    ifHave:      '',
  };

  store.commit('type-map/product', opts);

  const { product,
    configureType,
    virtualType,
    basicType } = $plugin.DSL(store, NEUVECTOR);

  product({
    icon:    'pod_security',
    inStore: 'cluster',
  });

  virtualType({
    labelKey: 'Dashboard',
    name:     NEUVECTOR_DASHBOARD,
    overview:    true,
    route:    {
      name:   `c-cluster-${ NEUVECTOR }`,
      params: { product: NEUVECTOR },
      meta:   { pkg: NEUVECTOR, product: NEUVECTOR }
    }
  });

  basicType([NEUVECTOR_DASHBOARD]);
}
