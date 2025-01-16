<script>
    export default {
        components: {
        },
        props: {
            disabled: Boolean,
        },
        methods: {
            undoChanges() {
                this.$store.dispatch('neuvector/updateNetworkRules',[]);
                setTimeout(() => {
                    this.$store.dispatch('neuvector/updateNetworkRules', this.$store.getters['neuvector/networkRulesBackup']);
                    this.$store.dispatch('neuvector/updateIsNetworkRuleListDirty', false);
                }, 200);
            }
        }
    };
</script>

<template>
    <div>
        <button
            mat-button
            class="btn role-secondary"
            aria-label="Undo changes"
            type="button"
            :disabled="disabled"
            @click="undoChanges()">
            {{ t('policy.toolBar.UNDO') }}
        </button>
    </div>
</template>