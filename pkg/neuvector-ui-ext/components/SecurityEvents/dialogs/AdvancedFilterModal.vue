<script>
    import { Card } from '@components/Card';
    import Checkbox from '@components/Form/Checkbox/Checkbox';
    import LabeledSelect from '@shell/components/form/LabeledSelect';
    import { LabeledInput } from '@components/Form/LabeledInput';
    import { parseAdvFilterParam, filterSecEvents, loadFilters } from '../../../utils/security-events';
    import { nvVariables } from '../../../types/neuvector';

    export default {
        components: {
          Card,
          Checkbox,
          LabeledSelect,
          LabeledInput
        },
        props: {
            isLightTheme: Boolean,
            autoCompleteData: Object,
            mode: { type: String, default: 'edit' }
        },
        fetch(){
          console.log("autoCompleteData", this.autoCompleteData)
        },
        methods: {
          close() {
            this.$emit('close');
          },
          update() {},
          reset() {
            this.filters = {
              dateFrom: nvVariables.securityEventsServiceData.filterItems.dateFrom,
              dateTo: nvVariables.securityEventsServiceData.filterItems.dateTo,
              severity: {
                error: false,
                critical: false,
                warning: false,
                info: false
              },
              location: {
                host: false,
                container: false
              },
              category: {
                network: false,
                package: false,
                file: false,
                tunnel: false,
                process: false,
                priviledge: false,
              },
              other: false,
              host: '',
              source: '',
              destination: '',
              domains: [],
              includedKeyword: '',
              excludedKeyword: ''
            };
            
            let filterParam = parseAdvFilterParam(this.filters);
            loadFilters(filterParam);
            filterSecEvents();
            this.$emit('close');
          },
          apply() {
            this.filters.dateFrom = nvVariables.securityEventsServiceData.filterItems.dateFrom;
            this.filters.dateTo = nvVariables.securityEventsServiceData.filterItems.dateTo;
            let filterParam = parseAdvFilterParam(this.filters);
            loadFilters(filterParam);
            filterSecEvents();
            this.$emit('close');
          }
        },
        data() {
          return {
            filters: {
              dateFrom: 0,
              dateTo: 0,
              severity: {
                error: false,
                critical: false,
                warning: false,
                info: false
              },
              location: {
                host: false,
                container: false
              },
              category: {
                network: false,
                package: false,
                file: false,
                tunnel: false,
                process: false,
                priviledge: false,
              },
              other: false,
              host: '',
              source: '',
              destination: '',
              domains: [],
              includedKeyword: nvVariables.securityEventsServiceData.filterItems.includedKeyword,
              excludedKeyword: ''
            }
          }
        }
    };
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal nv-modal" :class="isLightTheme ? 'light' : 'dark'">
      <Card :buttonAction="close" :buttonText="'Close'" :sticky="true">
        <template v-slot:title>
          <h5 class="p-10" :style="isLightTheme ? 'color: #888' : 'color: #fff'">
            {{ t('general.FILTER_MATCH_ALL') }}
          </h5>
        </template>
        <template v-slot:body>
          <div class="row mt-2">
            <div class="col span-3">{{ t('securityEvent.SEVERITY') }}</div>
            <div class="col span-9">
              <Checkbox v-model="filters.severity.error" :label="t('enum.ERROR')" @input="update"/>
              <Checkbox v-model="filters.severity.critical" :label="t('enum.CRITICAL')" @input="update"/>
              <Checkbox v-model="filters.severity.warning" :label="t('enum.WARNING')" @input="update"/>
              <Checkbox v-model="filters.severity.info" :label="t('enum.INFO')" @input="update"/>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col span-3">{{ t('securityEvent.LOCATION') }}</div>
            <div class="col span-9">
              <Checkbox v-model="filters.location.host" :label="t('securityEvent.label.HOST')" @input="update"/>
              <Checkbox v-model="filters.location.container" :label="t('securityEvent.label.CONTAINER')" @input="update"/>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col span-3">{{ t('event.gridHeader.CATEGORY') }}</div>
            <div class="col span-9">
              <Checkbox v-model="filters.category.network" :label="t('securityEvent.label.NETWORK')" @input="update"/>
              <Checkbox v-model="filters.category.package" :label="t('securityEvent.label.PACKAGE')" @input="update"/>
              <Checkbox v-model="filters.category.file" :label="t('securityEvent.label.FILE')" @input="update"/>
              <Checkbox v-model="filters.category.tunnel" :label="t('securityEvent.label.TUNNEL')" @input="update"/>
              <Checkbox v-model="filters.category.process" :label="t('securityEvent.label.PROCESS')" @input="update"/>
              <Checkbox v-model="filters.category.priviledge" :label="t('securityEvent.label.PRIVILEDGE')" @input="update"/>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col span-3"></div>
            <div class="col span-9">
              <Checkbox v-model="filters.other" :label="t('securityEvent.label.OTHER')" @input="update"/>
            </div>
          </div>
          <hr />
          <div class="mt-2">
            <LabeledSelect
              v-model="filters.host"
              :taggable="false"
              :close-on-select="false"
              :mode="mode"
              :multiple="false"
              :label="t('securityEvent.HOST')"
              :options="autoCompleteData.host"
              :disabled="mode==='view'"
              @input="update"
            />
          </div>
          <div class="mt-2">
            <LabeledSelect
              v-model="filters.source"
              :taggable="false"
              :close-on-select="false"
              :mode="mode"
              :multiple="false"
              :label="t('securityEvent.SOURCE')"
              :options="autoCompleteData.source"
              :disabled="mode==='view'"
              @input="update"
            />
          </div>
          <div class="mt-2">
            <LabeledSelect
              v-model="filters.destination"
              :taggable="false"
              :close-on-select="false"
              :mode="mode"
              :multiple="false"
              :label="t('securityEvent.DESTINATION')"
              :options="autoCompleteData.destination"
              :disabled="mode==='view'"
              @input="update"
            />
          </div>
          <div class="mt-2">
            <LabeledSelect
              v-model="filters.domains"
              :taggable="true"
              :close-on-select="false"
              :mode="mode"
              :multiple="true"
              :label="t('securityEvent.DOMAIN')"
              :options="autoCompleteData.domain"
              :disabled="mode==='view'"
              @input="update"
            />
          </div>
          <div class="mt-2">
            <LabeledInput
              class="nv-labal-input"
              v-model="filters.includedKeyword"
              :label="t('securityEvent.OTHER_KEYWORD')"
              :mode="mode"
              @input="update"
            />
          </div>
          <div class="mt-2">
            <LabeledInput
              class="nv-labal-input"
              v-model="filters.excludedKeyword"
              :label="t('securityEvent.EXCLUDED_KEYWORD')"
              :mode="mode"
              @input="update"
            />
          </div>
          <!-- {{ selectedRow.children }} -->
          <div class="mt-3">
            <a
              mat-button
              class="btn role-primary"
              aria-label="Reset all filters"
              type="button"
              @click="reset()">
              {{ t('enum.RESET') }}
            </a>
            <a
              mat-button
              class="btn role-primary"
              aria-label="Apply filters"
              type="button"
              @click="apply()">
              {{ t('enum.APPLY') }}
            </a>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>


<style lang="scss">
    .vs__dropdown-menu {
        z-index: 1000 !important;
    }
    .nv-labal-input {
      label {
        left: 10px !important;
      }
    }
    .nv-modal {
      text-align: left;
    }
</style>