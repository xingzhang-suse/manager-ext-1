import { IPlugin } from "@shell/core/types";

export function init($plugin: IPlugin, store: any) {
  const NEUVECTOR = "neuvector";

  const opts = {
    name: "neuvector",
    ifHaveGroup: "",
    ifHave: "",
  };

  store.commit("type-map/product", opts);

  const { product, virtualType, basicType } = $plugin.DSL(store, NEUVECTOR);

  product({
    icon: "pod_security",
    inStore: "cluster",
  });

  virtualType({
    labelKey: "neuvector.title",
    name: "neuvector-overview",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-dashboard`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "dashboard.SEC_EVENT",
    name: "neuvector-sec-events",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-sec-events`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "sidebar.nav.SCAN",
    name: "neuvector-scan",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-scan`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "sidebar.nav.BENCH",
    name: "neuvector-bench",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-bench`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "sidebar.nav.POLICY",
    name: "neuvector-policy",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-policy`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "sidebar.nav.RESPONSE_POLICY",
    name: "neuvector-response-rules",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-response-rules`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    labelKey: "sidebar.nav.NETWORK_ACTIVITY",
    name: "neuvector-network-activities",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-network-activities`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    label: "Topology",
    name: "neuvector-topology",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-topology`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });

  basicType([
    "neuvector-overview",
    "neuvector-sec-events",
    "neuvector-scan",
    "neuvector-bench",
    "neuvector-policy",
    "neuvector-response-rules",
    "neuvector-network-activities",
    "neuvector-topology",
  ]);
}
