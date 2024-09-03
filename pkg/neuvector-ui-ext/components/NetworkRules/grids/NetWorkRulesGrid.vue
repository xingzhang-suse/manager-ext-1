<script>
    import ResourceTable from '@shell/components/ResourceTable';
    import { parseDatetimeStr } from '../../../utils/common';
    import { RANCHER_CONST } from '../../../types/neuvector';
    import Action from './cells/Action';

    export default {
        components: {
            ResourceTable,
            Action,
        },
        props: {
          networkRules: Array,
        },
        data() {
          return {
            parseDatetimeStr: parseDatetimeStr,
            NETWORK_RULES_HEADER: [
              {
                name:  'id',
                value: 'id',
                label: this.t('policy.gridHeader.ID'),
                sort:  'id'
              },
              {
                name:  'from',
                value: 'from',
                label: this.t('policy.gridHeader.FROM'),
                sort:  'form'
              },
              {
                name:  'to',
                value: 'to',
                label: this.t('policy.gridHeader.TO'),
                sort:  'to'
              },
              {
                name:  'applications',
                value: 'applications',
                label: this.t('policy.gridHeader.APPLICATIONS'),
                sort:  'applications'
              },
              {
                name:  'ports',
                value: 'ports',
                label: this.t('policy.gridHeader.PORT'),
                sort:  'ports'
              },
              {
                name:  'action',
                value: 'action',
                label: this.t('policy.gridHeader.ACTION'),
                sort:  'action'
              },
              {
                name:  'cfg_type',
                value: 'cfg_type',
                label: this.t('policy.gridHeader.TYPE'),
                sort:  'cfg_type'
              },
              {
                name:  'last_modified_timestamp',
                value: 'last_modified_timestamp',
                label: this.t('policy.gridHeader.UPDATE_AT'),
                sort:  'last_modified_timestamp'
              },
            ],
            isLightTheme: sessionStorage.getItem(RANCHER_CONST.R_THEME) !== RANCHER_CONST.THEME.DARK,
          };
        },
        methods: {
        },
        computed: {
        }
    };
</script>

<template>
  <div class="network-rules-wrap">
    <ResourceTable
      data-testid="nv-network-rules-sortable-table"
      id="nv-network-rules-sortable-table"
      :rows="networkRules"
      :headers="NETWORK_RULES_HEADER"
      :table-actions="false"
      :row-actions="false"
      :paging="true"
    >
      <template #col:id="{row}">
        <td>
          <span>{{ row.id || '-' }}</span>
        </td>
      </template>

      <template #col:from="{row}">
        <td>
          <span>{{ row.from || '-' }}</span>
        </td>
      </template>

      <template #col:to="{row}">
        <td>
          <span>{{ row.to || '-' }}</span>
        </td>
      </template>

      <template #col:applications="{row}">
        <td>
          <span>{{ row.applications?.join(', ') || '-' }}</span>
        </td>
      </template>

      <template #col:ports="{row}">
        <td>
          <span>{{ row.ports || '-'}}</span>
        </td>
      </template>

      <template #col:action="{row}">
        <td>
          <Action :action="row.action" :id="row.id"></Action>
        </td>
      </template>

      <template #col:cfg_type="{row}">
        <td>
          <span>{{ row.cfg_type || '-' }}</span>
        </td>
      </template>

      <template #col:last_modified_timestamp="{row}">
        <td>
          <span>{{ row.last_modified_timestamp ? parseDatetimeStr(row.last_modified_timestamp, 'MMM DD, YYYY HH:mm:ss') : '-' }}</span>
        </td>
      </template>
    </ResourceTable>
  </div>
</template>


<style lang="scss">
    @import '../../../styles/neuvector.scss';
    #nv-network-rules-sortable-table table thead tr {
        background-color: var(--sortable-table-header-bg) !important;
        color: var(--body-text);
        text-align: left;
    }
   
    .network-rules-wrap {
        position: relative;
        .download-btn {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 20;
        }
    }

    .badge {
      border-radius: 4px;
    }

    .vul-cnt {
      display: block;
      margin: 3px 5px;
      span {
        margin: 0 5px;
      }
    }
</style>