<script>
    import { deleteRules } from '../../../utils/network-rules';
    export default {
        components: {
        },
        props: {
            disabled: Boolean,
        },
        methods: {
            async removeRules() {
                let networkRules = await this.$store.getters['neuvector/networkRules'];
                let selectedNetworkRules = await this.$store.getters['neuvector/selectedNetworkRules'];
                try {
                    await deleteRules(networkRules, selectedNetworkRules, this.$store);
                    this.gridApi.setRowData(this.$store.getters['neuvector/networkRules']);
                } catch(erorr) {
                    console.error(error);
                }
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
            @click="removeRules()">
            {{ t('policy.toolBar.REMOVE') }}
        </button>
    </div>
</template>