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
    label: store.getters["i18n/t"]("neuvector.title"),
    labelKey: "neuvector.dashboard.label",
    name: "neuvector-overview",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    label: store.getters["i18n/t"]("dashboard.SEC_EVENT"),
    labelKey: "neuvector.sec-event.label",
    name: "neuvector-sec-events",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-sec-events`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    label: store.getters["i18n/t"]("sidebar.nav.SCAN"),
    labelKey: "neuvector.scan.label",
    name: "neuvector-scan",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-scan`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });
  virtualType({
    label: store.getters["i18n/t"]("sidebar.nav.BENCH"),
    labelKey: "neuvector.bench.label",
    name: "neuvector-bench",
    namespaced: false,
    route: {
      name: `c-cluster-${NEUVECTOR}-bench`,
      params: { product: NEUVECTOR },
      meta: { pkg: "neuvector-ui-ext", product: NEUVECTOR },
    },
  });

  basicType([
    "neuvector-overview",
    "neuvector-sec-events",
    "neuvector-scan",
    "neuvector-bench",
  ]);
}
