<script>
    import { Card } from '@components/Card';
    import Checkbox from '@components/Form/Checkbox/Checkbox';
    export default {
        components: {
          Card,
          Checkbox
        },
        props: {
            isLightTheme: Boolean
        },
        methods: {
          close() {
            this.$emit('close');
          }
        },
        data() {
          return {
            severity: ''
          }
        }
    };
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal" :class="isLightTheme ? 'light' : 'dark'">
      <Card :buttonAction="close" :buttonText="'Close'" :sticky="true">
        <template v-slot:title>
          <h5 class="p-10" :style="isLightTheme ? 'color: #888' : 'color: #fff'">
            {{ t('general.FILTER_MATCH_ALL') }}
          </h5>
        </template>
        <template v-slot:body>
          <div>
            <div>{{ t('securityEvent.SEVERITY') }}</div>
            <div>
              <template><Checkbox :value="severity" label="high" /></template>
            </div>
          </div>
          <div>
            <div>{{ t('securityEvent.LOCATION') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('event.gridHeader.CATEGORY') }}</div>
            <div></div>
          </div>
          <hr />
          <div>
            <div>{{ t('securityEvent.HOST') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('securityEvent.SOURCE') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('securityEvent.DESTINATION') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('securityEvent.DOMAIN') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('securityEvent.OTHER_KEYWORD') }}</div>
            <div></div>
          </div>
          <div>
            <div>{{ t('securityEvent.EXCLUDED_KEYWORD') }}</div>
            <div></div>
          </div>
          <!-- {{ selectedRow.children }} -->
        </template>
      </Card>
    </div>
  </div>
</template>