<template>
    <div>
        <div class="rule-actions-expand fade-in-right" v-if="params.node.data.id > -1">
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="buttonDisplayMap.add"
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
                v-if="buttonDisplayMap.edit"
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
                v-if="buttonDisplayMap.delete"
                v-tooltip.top="{
                    content: t('policy.TIP.DELETE')
                }"
                @click="params.deleteSelectedRule(params)"
                aria-label="Delete rule"
            >
                <EOS_DELETE_FILLED class="icon-18 nv-svg-icon"></EOS_DELETE_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="buttonDisplayMap.undelete"
                v-tooltip.top="{
                    content: t('policy.TIP.UNDELETE')
                }"
                @click="params.undeleteSelectedRule(params)"
                aria-label="Undelete rule"
            >
                <EOS_RECYCLING_FILLED class="icon-18 nv-svg-icon"></EOS_RECYCLING_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="buttonDisplayMap.promote"
                v-tooltip.top="{
                    content: t('policy.PROMOTE')
                }"
                @click="params.promoteNeworkRuleOnEntry(params)"
                aria-label="Promote rule"
            >
                <EOS_INGRESS_FILLED class="icon-18 nv-svg-icon"></EOS_INGRESS_FILLED>
            </button>
            <button
                class="btn btn-sm role-secondary nv-p-2"
                v-if="buttonDisplayMap.revert"
                v-tooltip.top="{
                    content: t('policy.TIP.REVERT')
                }"
                @click="params.revertNetworkRule(params)"
                aria-label="Revert rule"
            >
                <EOS_SETTINGS_BACKUP_RESTORE_FILLED class="icon-18 nv-svg-icon"></EOS_SETTINGS_BACKUP_RESTORE_FILLED>
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
import { EOS_ADD_FILLED, EOS_EDIT_FILLED, EOS_DELETE_FILLED, EOS_RECYCLING_FILLED, EOS_INGRESS_FILLED, EOS_SETTINGS_BACKUP_RESTORE_FILLED } from 'eos-icons-vue2';
import { NV_CONST } from '../../../../types/neuvector';
export default {
  components: {
    EOS_ADD_FILLED,
    EOS_EDIT_FILLED,
    EOS_DELETE_FILLED,
    EOS_RECYCLING_FILLED,
    EOS_INGRESS_FILLED,
    EOS_SETTINGS_BACKUP_RESTORE_FILLED,
  },
  created() {
    this.buttonDisplayMap = {
      add: this.isOperatableRuleType,
      edit:
        !this.params.node.data.remove &&
        !this.params.node.data.learned &&
        this.isOperatableRuleType,
      delete:
        this.params.node.data.state !==
          NV_CONST.NETWORK_RULES_STATE.READONLY &&
        !this.params.node.data.remove &&
        this.isOperatableRuleType,
      undelete: this.params.node.data.remove && this.isOperatableRuleType,
      revert:
        this.params.node.data.state ===
          NV_CONST.NETWORK_RULES_STATE.READONLY &&
        this.isOperatableRuleType,
      promote: this.isPromotable,
    };
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
    isPromotable: function() {
        return   this.params.node.data.cfg_type === NV_CONST.CFG_TYPE.GROUND &&
            !(
                this.params.context.componentParent.source ===
                NV_CONST.NAV_SOURCE.SELF &&
                this.params.node.data.cfg_type === NV_CONST.CFG_TYPE.FED
            );
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