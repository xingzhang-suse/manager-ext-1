import { IPlugin } from '@shell/core/types';

export function init($plugin: IPlugin, store: any) {
  const NEUVECTOR = 'neuvector';

  const opts = {
    name:        'neuvector',
    ifHaveGroup: '',
    ifHave:      '',
  };

  store.commit('type-map/product', opts);

  const {
    product,
    virtualType,
    basicType
  } = $plugin.DSL(store, NEUVECTOR);

  product({
    icon:    'pod_security',
    inStore: 'cluster',
  });

  virtualType({
    labelKey:   'neuvector.dashboard.label',
    name:       'neuvector-overview',
    namespaced: false,
    route:      {
      name:   `c-cluster-${ NEUVECTOR }`,
      params: { product: NEUVECTOR },
      meta:   { pkg: NEUVECTOR, product: NEUVECTOR },
    }
  });

  basicType(['neuvector-overview']);
}
