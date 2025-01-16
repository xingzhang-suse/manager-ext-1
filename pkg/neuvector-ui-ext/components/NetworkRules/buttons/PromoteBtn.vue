<script>
    import { promoteNetworkRulesData } from '../../../plugins/network-rule-class';
    export default {
        components: {
        },
        props: {
            reloadData: Function,
            disabled: Boolean,
        },
        methods: {
            async promoteRuleOnTop() {
                let selectedNetworkRules = await this.$store.getters['neuvector/selectedNetworkRules'];
                let payload = {
                    request: {
                        ids: selectedNetworkRules.map(rule => rule.id),
                    },
                };
                try {
                    await promoteNetworkRulesData(payload);
                    await reloadData();
                    this.gridApi.setRowData(this.$store.getters['neuvector/networkRules']);
                } catch(error) {
                    console.error(error);
                };
            },
        }
    };
</script>

<template>
    <div>
        <button
            mat-button
            class="btn role-secondary"
            aria-label="Remove rules"
            type="button"
            :disabled="disabled"
            @click="promoteRuleOnTop()">
            {{ t('policy.PROMOTE') }}
        </button>
    </div>
</template>