<script>
    import Confirmation from '../../common/dialogs/Confirmation';
    import { submitNetworkRule } from '../../../plugins/network-rule-class';
    import { NV_CONST } from '../../../types/neuvector';

    export default {
        components: {
            Confirmation,
        },
        props: {
            reloadFn: Function,
        },
        data() {
            return {
                showConfirmationModal: false,
            };
        },
        methods: {
            closeConfirmationModal() {
                this.showConfirmationModal = false;
            },
            confirmSaving() {
                this.showConfirmationModal = true;
            },
            async saveRules() {
                let networkRulesCopy = JSON.parse(JSON.stringify(this.$store.getters['neuvector/networkRules']));
                let UpdateRulesRes = await submitNetworkRule(networkRulesCopy, NV_CONST.NAV_SOURCE.SELF);
                this.$store.dispatch('neuvector/updateIsNetworkRuleListDirty', false);
                this.showConfirmationModal = false;
                this.$store.dispatch('neuvector/initializeNewId');
                this.reloadFn()
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-primary"
            aria-label="Save rules"
            type="button"
            @click="confirmSaving()">
            {{ t('policy.toolBar.SAVE') }}
        </a>
        <Confirmation v-if="showConfirmationModal" :message="t('policy.POLICY_DEPLOY_CONFIRM')" @close="closeConfirmationModal" :okFn="saveRules"></Confirmation>
    </div>
</template>