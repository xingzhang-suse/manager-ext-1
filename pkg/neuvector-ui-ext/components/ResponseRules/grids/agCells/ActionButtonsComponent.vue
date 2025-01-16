<template>
    <div>
        <div class="rule-actions-expand fade-in-right" v-if="params.node.data.id > -1">
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="isOperatableRuleType && isWriteResponseRuleAuthorized"
                v-tooltip.top="{
                    content: t('policy.TIP.ADD')
                }"
                @click="params.addRuleBelow(params)"
                aria-label="Add rule below"
            >
                <EOS_ADD_FILLED class="icon-18 nv-svg-icon" style="fill: rgb(61, 152, 211)"></EOS_ADD_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="isOperatableRuleType && isWriteResponseRuleAuthorized"
                v-tooltip.top="{
                    content: t('policy.TIP.EDIT')
                }"
                @click="params.editRule(params)"
                aria-label="Edit rule"
            >
                <EOS_EDIT_FILLED class="icon-18 nv-svg-icon"></EOS_EDIT_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="!(isOperatableRuleType && isWriteResponseRuleAuthorized)"
                v-tooltip.top="{
                    content: t('policy.editPolicy.VIEW')
                }"
                @click="params.viewRule(params)"
                aria-label="View rule"
            >
                <EOS_TEXT_SNIPPET_FILLED class="icon-18 nv-svg-icon"></EOS_TEXT_SNIPPET_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="!params.data.disable && isOperatableRuleType && isWriteResponseRuleAuthorized"
                v-tooltip.top="{
                    content: t('policy.TIP.DISABLE')
                }"
                @click="params.disableSelectedRule(params)"
                aria-label="Disable rule"
            >
                <EOS_HIGHLIGHT_OFF_FILLED class="icon-18 nv-svg-icon"></EOS_HIGHLIGHT_OFF_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="params.data.disable && isOperatableRuleType && isWriteResponseRuleAuthorized"
                v-tooltip.top="{
                    content: t('policy.TIP.ENABLE')
                }"
                @click="params.enableSelectedRule(params)"
                aria-label="Enable rule"
            >
                <EOS_TASK_ALT_FILLED class="icon-18 nv-svg-icon"></EOS_TASK_ALT_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="isOperatableRuleType && isWriteResponseRuleAuthorized"
                v-tooltip.top="{
                    content: t('policy.TIP.ADD')
                }"
                @click="params.deleteSelectedRule(params)"
                aria-label="Delete rule"
            >
                <EOS_DELETE_FILLED class="icon-18 nv-svg-icon"></EOS_DELETE_FILLED>
            </button>
            
        </div>
        <div class="rule-actions-collapse text-action" v-if="isOperatableRuleType || isPromotable">
            <span class="hand">
                &#46;&#46;&#46;
            </span>
        </div>
    </div>
</template>

<script>
import { EOS_ADD_FILLED, EOS_EDIT_FILLED, EOS_DELETE_FILLED, EOS_TEXT_SNIPPET_FILLED, EOS_HIGHLIGHT_OFF_FILLED, EOS_TASK_ALT_FILLED } from 'eos-icons-vue2';
import { NV_CONST } from '../../../../types/neuvector';
import { getDisplayFlag } from '../../../../utils/auth';

export default {
  components: {
    EOS_ADD_FILLED,
    EOS_EDIT_FILLED,
    EOS_DELETE_FILLED,
    EOS_TEXT_SNIPPET_FILLED,
    EOS_HIGHLIGHT_OFF_FILLED,
    EOS_TASK_ALT_FILLED,

  },
  created() {

  },
  computed: {
    isOperatableRuleType: function() {
        return this.params.node.data.cfg_type !== NV_CONST.CFG_TYPE.GROUND &&
            !(
                this.params.context.componentParent.source ===
                NV_CONST.NAV_SOURCE.SELF &&
                this.params.node.data.cfg_type === NV_CONST.CFG_TYPE.FED
            );
    },
    isWriteResponseRuleAuthorized: function() {
        return getDisplayFlag('write_response_rule', this.$store) &&
        (this.params.source !== NV_CONST.NAV_SOURCE.GROUP &&
        this.params.source !== NV_CONST.NAV_SOURCE.SELF
            ? getDisplayFlag('multi_cluster_w', this.$store)
            : true);
        },
  },
  methods: {
    refresh(params) {
      this.params = params
    }
  }
};
</script>

<style scoped>
.btn-sm {
  min-height: 24px;
}
.nv-p-2 {
    padding: 0 2px;
}
.nv-svg-icon {
    fill: rgb(61, 152, 211);
}
</style>