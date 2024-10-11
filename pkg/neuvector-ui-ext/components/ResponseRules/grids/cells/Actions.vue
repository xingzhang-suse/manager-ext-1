<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
           actions: Array,
           disable: Boolean,
        },
        computed: {
            getActions() {
                let actions = [];
                this.actions?.forEach(action => {
                    actions.push({
                        className: this.disable
                            ? NV_MAP.colourMap['disabled_color']
                            : NV_MAP.colourMap[action.toLowerCase()],
                        text: this.t('responsePolicy.actions.' + action.toUpperCase()),
                    });
                });
                return actions;
            }
        }
    }
</script>

<template>
    <div>
        <div style="margin: 2px 2px; float: left">
            <div v-for="action in getActions" :class="'resp-rule-action-label px-1 ' + action.className">
                {{ action.text }}
            </div>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';

.resp-rule-action-label {
  height: 20px;
  line-height: 18px;
  min-width: 80px;
  color: #000;
  font-size: 12px;
  border-radius: 4px;
  text-align: center;
  margin: 5px 5px;
  &.webhook {
    // background-color: $mdc-light-blue-400;
    border: 1px solid $mdc-light-blue-400;
    color: $mdc-light-blue-400;
  }

  &.quarantine {
    // background-color: $mdc-red-400;
    border: 1px solid $mdc-red-400;
    color: $mdc-red-400;
  }

  &.default {
    // background-color: $mdc-red-400;
    border: 1px solid $mdc-light-green-700;
    color: $mdc-light-green-700;
  }

  &.suppress-log {
    // background-color: $mdc-red-400;
    border: 1px solid $mdc-orange-500;
    color: $mdc-orange-500;
  }
}
</style>