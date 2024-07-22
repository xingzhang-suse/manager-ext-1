<script>
    import { Card } from '@components/Card';
    import Checkbox from '@components/Form/Checkbox/Checkbox';
    import LabeledSelect from '@shell/components/form/LabeledSelect';
    import { LabeledInput } from '@components/Form/LabeledInput';
    import { RadioGroup } from '@components/Form/Radio';

    export default {
        components: {
          Card,
          Checkbox,
          LabeledSelect,
          LabeledInput,
          RadioGroup
        },
        props: {
            isLightTheme: Boolean,
            advFilter: Object
        },
        fetch() {
          console.log(this.advFilter);
        },
        methods: {
          close() {
            this.$emit('close');
          },
          reset() {
            this.$emit('close', { reset: true });
          },
          apply() {
            this.$emit('close', this.advFilter);
          }
        },
        data() {
          return {
            scoredOptions: [
              { label: this.t('setting.ALL'), value: 'all' },
              { label: this.t('scan.WITH_FIX'), value: 'withFix' },
              { label: this.t('scan.WITHOUT_FIX'), value: 'withoutFix' },
            ],
            severityOptions: [
              { label: this.t('setting.ALL'), value: 'all' },
              { label: this.t('enum.HIGH'), value: 'high' },
              { label: this.t('enum.MEDIUM'), value: 'medium' },
              { label: this.t('enum.LOW'), value: 'low' },
            ]
          };
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
            <div class="col span-3">{{ t('cis.report.gridHeader.SCORED') }}</div>
            <div class="col span-9">
              <RadioGroup name="score_filter" :options="scoredOptions" :row="true" />
            </div>
          </div>
          <div class="row mt-2">
            <div class="col span-3">{{ t('profile.TITLE') }}</div>
            <div class="col span-9">
              <RadioGroup name="severity_filter" :options="severityOptions" :row="true" />
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