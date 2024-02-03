<template>
    <ag-grid-vue
      id="agGrid"
      style="width: 100%; height: 300px"
      class="ag-theme-balham-dark"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>
</template>
  
<script>
  import Vue from 'vue';
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-balham.min.css";
  import { AgGridVue } from "ag-grid-vue";
  // import ExposedServicePodGridServicePodCellComponent from './components/ExposedServicePodGridServicePodCellComponent';
  
  const ExposedServicePodGridServicePodCellComponent = Vue.extend(
    {template: '<span>{{ valueCubed() }}</span>',
   methods: {
       valueCubed() {
           return 'test'+this.params.value;
       }
   }}
  )

  export default {
    name: "App",
    props: {
      exposureInfo: Array,
      exposureType: String
    },
    data() {
      return {
        columnDefs: null,
        rowData: null,
        gridOptions: null
      };
    },
    components: {
      AgGridVue
    },
    beforeMount() {
      const colourMap = {
        'security-event': 'threat',
        Debug: 'inverse',
        Info: 'info',
        Notice: 'idle',
        Warning: 'warning',
        error: 'pink',
        Error: 'pink',
        ERROR: 'pink',
        Critical: 'danger',
        critical: 'danger',
        Alert: 'pink',
        Emergency: 'danger',
        Low: 'success',
        Medium: 'warning',
        High: 'danger',
        HIGH: 'danger',
        Moderate: 'warning',
        Important: 'danger',
        disconnected: 'warning',
        discover: 'discover',
        protect: 'protect',
        unmanaged: 'warning',
        monitor: 'monitor',
        quarantined: 'pink',
        connected: 'success',
        stopped: 'inverse',
        Discover: 'discover',
        Monitor: 'monitor',
        Protect: 'protect',
        allow: 'allow',
        exception: 'success',
        deny: 'deny',
        alert: 'warning',
        block_access: 'deny',
        monitor_change: 'info',
        LEARNED: 'learn-rule',
        CUSTOM: 'customer-rule',
        GROUND: 'ground-rule',
        FED: 'fed-rule',
        USER_CREATED: 'customer-rule',
        FEDERAL: 'fed-rule',
        SYSTEM_DEFINED: 'predefined',
        learned: 'learn-rule',
        user_created: 'customer-rule',
        'new-rule': 'new-rule',
        'modified-rule': 'modified-rule',
        'disabled-rule': 'disabled-rule',
        ground: 'ground-rule',
        'removed-rule': 'removed-rule',
        federal: 'fed-rule',
        'readonly-rule': 'readonly-rule',
        'moved-rule': 'moved-rule',
        modify: 'modify-permission',
        view: 'view-permission',
        finished: 'info',
        idle: 'idle',
        scanning: 'primary',
        running: 'primary',
        scheduled: 'inverse',
        failed: 'danger',
        unsupported: 'warning',
        NOTE: 'note',
        PASS: 'success',
        WARN: 'warning',
        INFO: 'info',
        violate: 'warning',
        threat: 'threat',
        violation: 'violation',
        incident: 'incident',
        event: 'event',
        'cve-report': 'cve-report',
        compliance: 'benchmark',
        quarantine: 'quarantine',
        webhook: 'webhook',
        'suppress-log': 'suppress-log',
        disabled_background: 'disabled-action',
        disabled_color: 'disabled-action-2',
        err: 'danger',
        block: 'danger',
        'admission-control': 'admission-control',
        mc_active: 'info',
        mc_pinging: 'idle',
        mc_unknown_cmd: 'idle',
        mc_notified: 'info',
        mc_req_error: 'warning',
        mc_master_upgrade_required: 'warning',
        mc_joint_upgrade_required: 'warning',
        mc_cluster_upgrade_ongoing: 'warning',
        mc_joint_version_too_new: 'warning',
        mc_connected: 'success',
        mc_disconnected: 'danger',
        mc_joined: 'joined',
        mc_pending: 'warning',
        mc_out_of_sync: 'danger-tran',
        mc_synced: 'success',
        mc_syncing: 'idle',
        mc_kicked: 'danger',
        mc_left: 'danger',
        mc_license_disallow: 'danger',
        comment: 'idle',
        url: 'info',
        response: 'success',
        images: 'idle',
      };
      this.columnDefs = [
        {
          headerName: this.t('dashboard.body.panel_title.SERVICE'),
          field: 'service',
          // cellRenderer: ExposedServicePodGridServicePodCellComponent,
          width: 280,
          sortable: false,
        },
        {
          headerName: this.t('dashboard.body.panel_title.PODS'),
          field: 'children',
          valueFormatter: params => {
            return params.value.length;
          },
          width: 70,
        },
        {
          headerName: 'Parent ID',
          field: 'parent_id',
          hide: true,
        },
        {
          headerName: this.t('dashboard.body.panel_title.POLICY_MODE'),
          field: 'policy_mode',
          cellRenderer: params => {
            let mode = '';
            if (params.data && params.value) {
              mode = params.value;
              let labelCode = colourMap[params.value];
              if (!labelCode) return null;
              else
                return `<span class='type-label policy_mode ${labelCode}'>${
                  this.t(`dashboard.body.panel_title.${mode.toUpperCase()}`)
                }</span>`;
            }
            return null;
          },
          width: 150,
          maxWidth: 150,
          minWidth: 150,
          sortable: false,
        },
        {
          headerName: this.t('dashboard.body.panel_title.POLICY_ACTION'),
          field: 'policy_action',
          cellRenderer: params => {
            if (params.data) {
              return `<span ng-class='{\'policy-remove\': data.remove}'
                    class='action-label px-1 ${
                     colourMap[params.data.policy_action.toLowerCase()]
                    }'>
                    ${this.t(`dashboard.body.panel_title.${params.data.policy_action.toUpperCase()}`)}
                  </span>`;
            }
            return null;
          },
          width: 130,
          maxWidth: 130,
          minWidth: 130,
          sortable: false,
        }
      ];
  
      this.rowData = [
          {
              "id": "e1c9e7de-c4b8-4289-978c-b8cec4d3b630",
              "child_id": "d59d713b-e97b-419c-bf54-0561e750bbd6",
              "workload_id": "",
              "peerEndpoint": "",
              "service": "coredns.kube-system",
              "policy_mode": "Discover",
              "workload": "",
              "bytes": 0,
              "sessions": 0,
              "severity": "",
              "policy_action": "allow",
              "event_type": "",
              "protocols": "",
              "applications": [
                  "DNS"
              ],
              "ports": [],
              "entries": [
                  {
                      "applications": [
                          "DNS"
                      ],
                      "sessions": 348327,
                      "policy_action": "allow",
                      "ip": "8.8.8.8",
                      "fqdn": "",
                      "country_code": "us",
                      "country_name": "United States of America"
                  }
              ],
              "children": [
                  {
                      "pod_name": "coredns-bd6b6df9f-fnkh2",
                      "name": "k8s_POD_coredns-bd6b6df9f-fnkh2_kube-system_5b7ad6d5-0c88-40b0-99f5-a1bd7b12d1ff_11",
                      "protocols": [
                          "udp"
                      ],
                      "applications": [
                          "DNS"
                      ],
                      "display_name": "coredns-bd6b6df9f-fnkh2",
                      "service": "",
                      "policy_action": "allow",
                      "id": "99d6bba1f101a47c7ee20552143dd96ee3e27f5ddd931627acc2e0c4217da2bc",
                      "entries": [
                          {
                              "application": "DNS",
                              "server_ip": "8.8.8.8",
                              "sessions": 174098,
                              "policy_action": "allow",
                              "bytes": 235103445,
                              "client_ip": "10.244.0.8",
                              "id": "83eb7b5c-2af0-42bc-ae9f-78d95aafdf11",
                              "ip": "8.8.8.8",
                              "country_code": "us",
                              "country_name": "United States of America"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  },
                  {
                      "pod_name": "coredns-bd6b6df9f-qddd6",
                      "name": "k8s_POD_coredns-bd6b6df9f-qddd6_kube-system_683604cc-7332-4349-b606-49227ddf89e4_11",
                      "protocols": [
                          "udp"
                      ],
                      "applications": [
                          "DNS"
                      ],
                      "display_name": "coredns-bd6b6df9f-qddd6",
                      "service": "",
                      "policy_action": "allow",
                      "id": "3245f771ef57820a215272c583195ab00e3bd1030f99c151be426240f0a63e87",
                      "entries": [
                          {
                              "application": "DNS",
                              "server_ip": "8.8.8.8",
                              "sessions": 174229,
                              "policy_action": "allow",
                              "bytes": 235192512,
                              "client_ip": "10.244.0.6",
                              "id": "48ed1932-6f61-4079-b3d0-29333fe90a9f",
                              "ip": "8.8.8.8",
                              "country_code": "us",
                              "country_name": "United States of America"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  }
              ],
              "pods": 2,
              "visible": false
          },
          {
              "id": "d59d713b-e97b-419c-bf54-0561e750bbd6",
              "parent_id": "e1c9e7de-c4b8-4289-978c-b8cec4d3b630",
              "workload_id": "",
              "peerEndpoint": "",
              "service": "coredns.kube-system",
              "policy_mode": "Discover",
              "workload": "",
              "bytes": 0,
              "sessions": 0,
              "severity": "",
              "policy_action": "",
              "event_type": "",
              "protocols": "",
              "applications": [
                  "DNS"
              ],
              "ports": [],
              "entries": [
                  {
                      "applications": [
                          "DNS"
                      ],
                      "sessions": 348327,
                      "policy_action": "allow",
                      "ip": "8.8.8.8",
                      "fqdn": "",
                      "country_code": "us",
                      "country_name": "United States of America"
                  }
              ],
              "children": [
                  {
                      "pod_name": "coredns-bd6b6df9f-fnkh2",
                      "name": "k8s_POD_coredns-bd6b6df9f-fnkh2_kube-system_5b7ad6d5-0c88-40b0-99f5-a1bd7b12d1ff_11",
                      "protocols": [
                          "udp"
                      ],
                      "applications": [
                          "DNS"
                      ],
                      "display_name": "coredns-bd6b6df9f-fnkh2",
                      "service": "",
                      "policy_action": "allow",
                      "id": "99d6bba1f101a47c7ee20552143dd96ee3e27f5ddd931627acc2e0c4217da2bc",
                      "entries": [
                          {
                              "application": "DNS",
                              "server_ip": "8.8.8.8",
                              "sessions": 174098,
                              "policy_action": "allow",
                              "bytes": 235103445,
                              "client_ip": "10.244.0.8",
                              "id": "83eb7b5c-2af0-42bc-ae9f-78d95aafdf11",
                              "ip": "8.8.8.8",
                              "country_code": "us",
                              "country_name": "United States of America"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  },
                  {
                      "pod_name": "coredns-bd6b6df9f-qddd6",
                      "name": "k8s_POD_coredns-bd6b6df9f-qddd6_kube-system_683604cc-7332-4349-b606-49227ddf89e4_11",
                      "protocols": [
                          "udp"
                      ],
                      "applications": [
                          "DNS"
                      ],
                      "display_name": "coredns-bd6b6df9f-qddd6",
                      "service": "",
                      "policy_action": "allow",
                      "id": "3245f771ef57820a215272c583195ab00e3bd1030f99c151be426240f0a63e87",
                      "entries": [
                          {
                              "application": "DNS",
                              "server_ip": "8.8.8.8",
                              "sessions": 174229,
                              "policy_action": "allow",
                              "bytes": 235192512,
                              "client_ip": "10.244.0.6",
                              "id": "48ed1932-6f61-4079-b3d0-29333fe90a9f",
                              "ip": "8.8.8.8",
                              "country_code": "us",
                              "country_name": "United States of America"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  }
              ],
              "pods": 2,
              "visible": false
          },
          {
              "id": "91b73824-1b03-4568-8109-deb46c1aa97b",
              "child_id": "093d76c2-263b-4ee9-b438-a9247b57c71b",
              "workload_id": "",
              "peerEndpoint": "",
              "service": "kube-apiserver.kube-system",
              "policy_mode": "Discover",
              "workload": "",
              "bytes": 0,
              "sessions": 0,
              "severity": "",
              "policy_action": "allow",
              "event_type": "",
              "protocols": "",
              "applications": [
                  "tcp/443"
              ],
              "ports": [],
              "entries": [
                  {
                      "applications": [
                          null
                      ],
                      "sessions": 1,
                      "policy_action": "allow",
                      "ip": "10.107.134.83",
                      "fqdn": "",
                      "country_code": "-",
                      "country_name": "-"
                  }
              ],
              "children": [
                  {
                      "pod_name": "kube-apiserver-master",
                      "name": "k8s_POD_kube-apiserver-master_kube-system_3739fccd4e5a9393967a7f9c03e683d0_1",
                      "protocols": [
                          "tcp"
                      ],
                      "applications": [],
                      "display_name": "kube-apiserver-master",
                      "ports": [
                          "tcp/443"
                      ],
                      "service": "",
                      "policy_action": "allow",
                      "id": "c60ef8de0fb1619cb2395f4d62cce9f3feb403e71f33a98a452601572e4fa85a",
                      "entries": [
                          {
                              "server_ip": "10.107.134.83",
                              "sessions": 1,
                              "policy_action": "allow",
                              "bytes": 0,
                              "port": "tcp/443",
                              "client_ip": "10.1.3.30",
                              "id": "60bad077-d854-43e2-af65-69b03e28fbb1",
                              "ip": "10.107.134.83",
                              "country_code": "-",
                              "country_name": "-"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  }
              ],
              "pods": 1,
              "visible": false
          },
          {
              "id": "093d76c2-263b-4ee9-b438-a9247b57c71b",
              "parent_id": "91b73824-1b03-4568-8109-deb46c1aa97b",
              "workload_id": "",
              "peerEndpoint": "",
              "service": "kube-apiserver.kube-system",
              "policy_mode": "Discover",
              "workload": "",
              "bytes": 0,
              "sessions": 0,
              "severity": "",
              "policy_action": "",
              "event_type": "",
              "protocols": "",
              "applications": [
                  "tcp/443"
              ],
              "ports": [],
              "entries": [
                  {
                      "applications": [
                          null
                      ],
                      "sessions": 1,
                      "policy_action": "allow",
                      "ip": "10.107.134.83",
                      "fqdn": "",
                      "country_code": "-",
                      "country_name": "-"
                  }
              ],
              "children": [
                  {
                      "pod_name": "kube-apiserver-master",
                      "name": "k8s_POD_kube-apiserver-master_kube-system_3739fccd4e5a9393967a7f9c03e683d0_1",
                      "protocols": [
                          "tcp"
                      ],
                      "applications": [],
                      "display_name": "kube-apiserver-master",
                      "ports": [
                          "tcp/443"
                      ],
                      "service": "",
                      "policy_action": "allow",
                      "id": "c60ef8de0fb1619cb2395f4d62cce9f3feb403e71f33a98a452601572e4fa85a",
                      "entries": [
                          {
                              "server_ip": "10.107.134.83",
                              "sessions": 1,
                              "policy_action": "allow",
                              "bytes": 0,
                              "port": "tcp/443",
                              "client_ip": "10.1.3.30",
                              "id": "60bad077-d854-43e2-af65-69b03e28fbb1",
                              "ip": "10.107.134.83",
                              "country_code": "-",
                              "country_name": "-"
                          }
                      ],
                      "severity": "",
                      "policy_mode": "Discover"
                  }
              ],
              "pods": 1,
              "visible": false
          }
      ];
      this.gridOptions = {
        defaultColDef: {
          sortable: true,
          flex: 1,
          autoHeight: true,
          sortable: true,
          resizable: true,
          cellClass: ['d-flex', 'align-items-center', 'cell-wrap-text'],
        },
        headerHeight: 30,
        rowHeight: 30,
        suppressDragLeaveHidesColumns: true,
        rowData: null,
        animateRows: true,
        rowSelection: 'single',
        icons: {
          sortAscending: '<em class="fa fa-sort-alpha-down"></em>',
          sortDescending: '<em class="fa fa-sort-alpha-up"></em>',
        },

        onColumnResized: params => {
          params.api.resetRowHeights();
        },
        isExternalFilterPresent: () => true,
        doesExternalFilterPass: params => !params.data.parent_id || params.data.visible,
        getRowId: params => params.data.id,
        getRowHeight: params => !!params.data.parent_id ? 100 : 30,
        isFullWidthCell: node => !!node.data.parent_id,
        // fullWidthCellRenderer: 'conversationEntryListRenderer',
        suppressMaintainUnsortedOrder: true,
        suppressScrollOnNewData: true,
        components: {
          // serviceCellRenderer: ExposedServicepodGridServicepodCellComponent,
        //   actionCellRenderer: ExposedServicePodGridActionCellComponent,
        //   conversationEntryListRenderer: ConversationEntryListComponent
        },

        onGridReady: params => {
          setTimeout(() => {
            params.api.sizeColumnsToFit();
          }, 300);
          window.addEventListener('resize.#agGrid', () => {
            setTimeout(() => {
              params.api.sizeColumnsToFit();
            }, 100);
          });
        },
        overlayNoRowsTemplate: `<span class="overlay">No rows to show</span>`,
      };
    },
  };
  </script>
  <style lang="scss">
  
  .ag-theme-custom-dark {
    // Custom dark theme styles
    // Example:
    background-color: #333;
    color: #fff;
  }
  
  .ag-theme-custom-dark .ag-header {
    // Custom header styles
  }
  
  .ag-theme-custom-dark .ag-row {
    // Custom row styles
  }
  
  // Apply the custom dark theme class to the ag-grid-vue component
  .ag-theme-custom-dark {
    .ag-root {
      // Custom root styles
    }
  }
  </style>