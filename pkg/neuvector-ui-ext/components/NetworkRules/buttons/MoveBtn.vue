<script>
    import MoveRulesModal from '../dialogs/MoveRulesModal';

    export default {
        components: {
            MoveRulesModal,
        },
        props: {
            disabled: Boolean,
        },
        data() {
            return {
                showMoveRulesModal: false,
            };
        },
        methods: {
            closeMoveRulesModal() {
                this.showMoveRulesModal = false;
            },
            openMoveRulesModal() {
                this.showMoveRulesModal = true;
            },
        }
    };
</script>

<template>
    <div>
        <button
            mat-button
            class="btn role-secondary"
            aria-label="Move sequence of rules"
            :disabled="disabled"
            type="button"
            @click="openMoveRulesModal()">
            {{ t('policy.toolBar.MOVE_TO') }}
        </button>
        <MoveRulesModal v-if="showMoveRulesModal" :message="t('policy.POLICY_DEPLOY_CONFIRM')" @close="closeMoveRulesModal"></MoveRulesModal>
    </div>
</template>