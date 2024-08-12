<script>
    import SortableTable from '@shell/components/SortableTable';
    import { capitalize, parseDatetimeStr } from '../../../utils/common';
    import { Banner } from '@components/Banner';
    import DownloadVulnerabilititesCSV from '../buttons/DownloadVulnerabilititesCSV';

    export default {
        components: {
          SortableTable,
          Banner,
          DownloadVulnerabilititesCSV,
        },
        props: {
            vulnerabilities: Array,
            csvFileName: String,
        },
        data() {
          return {
            capitalize: capitalize,
            parseDatetimeStr: parseDatetimeStr,
            VUL_HEADER: [
              {
                name:  'name',
                value: 'name',
                label: this.t('scan.gridHeader.NAME'),
                sort:  'name'
              },
              {
                name:  'severity',
                value: 'severity',
                label: this.t('scan.gridHeader.SEVERITY'),
                sort:  'severity'
              },
              {
                name:  'score',
                value: 'score',
                label: this.t('scan.gridHeader.SCORE'),
                sort:  'score'
              },
              {
                name:  'feed_rating',
                value: 'feed_rating',
                label: this.t('scan.gridHeader.FEED_RATING'),
                sort:  'feed_rating'
              },
              {
                name:  'file_name',
                value: 'file_name',
                label: this.t('scan.gridHeader.FILE_NAME'),
                sort:  'file_name'
              },
              {
                name:  'package_name',
                value: 'package_name',
                label: this.t('scan.gridHeader.PACKAGE_NAME'),
                sort:  'package_name'
              },
              {
                name:  'package_version',
                value: 'package_version',
                label: this.t('scan.gridHeader.VERSION'),
                sort:  'package_version'
              },
              {
                name:  'fixed_version',
                value: 'fixed_version',
                label: this.t('scan.gridHeader.FIXED_BY'),
                sort:  'fixed_version'
              },
              {
                name:  'published_timestamp',
                value: 'published_timestamp',
                label: this.t('scan.gridHeader.PUBLISHED_TIME'),
                sort:  'published_timestamp'
              },
            ]
          };
        },
    };
</script>

<template>
  <div class="vulnerabilities-wrap">
    <DownloadVulnerabilititesCSV class="download-btn" :csvFileName="csvFileName" :vulnerabilities="vulnerabilities"></DownloadVulnerabilititesCSV>
    <SortableTable
      data-testid="nv-vul-sortable-table"
      id="nv-vul-sortable-table"
      :rows="vulnerabilities"
      :headers="VUL_HEADER"
      :table-actions="false"
      :row-actions="false"
      default-sort-by="name"
    >
      <template #col:name="{row}">
        <td>
          <span>{{ row.name || '-' }}</span>
        </td>
      </template>

      <template #col:severity="{row}">
        <td>
          <span :class="'pl-2 pr-2 badge ' + (row.severity.toLowerCase() === 'high' ? 'badge-danger' : 'badge-warning')">{{ row.severity || '-' }}</span>
        </td>
      </template>

      <template #col:score="{row}">
        <td>
          <span>{{ row.score || '-' }} / {{ row.score_v3 || '-' }}</span>
        </td>
      </template>

      <template #col:feed_rating="{row}">
        <td>
          <span>{{ capitalize(row.feed_rating || '-')}}</span>
        </td>
      </template>

      <template #col:file_name="{row}">
        <td>
          <span>{{ row.file_name || '-' }}</span>
        </td>
      </template>

      <template #col:package_name="{row}">
        <td>
          <span>{{ row.package_name || '-' }}</span>
        </td>
      </template>

      <template #col:package_version="{row}">
        <td>
          <span>{{ row.package_version || '-'  }}</span>
        </td>
      </template>

      <template #col:fixed_version="{row}">
        <td>
          <span>{{ row.fixed_version || '-' }}</span>
        </td>
      </template>

      <template #col:published_timestamp="{row}">
        <td>
          <span>{{ parseDatetimeStr(row.published_timestamp, 'MMM DD, YYYY') }}</span>
        </td>
      </template>
    </SortableTable>
  </div>
</template>


<style lang="scss">
    #nv-vul-sortable-table table thead tr {
        background-color: var(--sortable-table-header-bg) !important;
        color: var(--body-text);
        text-align: left;
    }
   
    .vulnerabilities-wrap {
        position: relative;
        .download-btn {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 20;
        }
    }
</style>