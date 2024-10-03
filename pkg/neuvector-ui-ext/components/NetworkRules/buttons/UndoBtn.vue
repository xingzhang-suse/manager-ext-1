<script>
    export default {
        components: {
        },
        props: {
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
        <a
            mat-button
            class="btn role-secondary"
            aria-label="Undo changes"
            type="button"
            @click="undoChanges()">
            {{ t('policy.toolBar.UNDO') }}
        </a>
    </div>
</template>