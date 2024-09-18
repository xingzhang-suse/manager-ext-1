<script>
    import AddEditRuleModal from '../dialogs/AddEditRuleModal';
    export default {
        components: {
            AddEditRuleModal,
        },
        props: {
            autoCompleteData: Object,
            isLightTheme: Boolean,
        },
        methods: {
            openAddEditRuleModal: function() {
                this.$refs.addEditRule.show();
            },
            closeModal: function() {
                this.showModal = false;
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-primary"
            aria-label="Open add rule modal"
            type="button"
            @click="openAddEditRuleModal()">
            {{ t('policy.toolBar.INSERT_TO_TOP') }}
        </a>
        <AddEditRuleModal 
            ref="addEditRule"
            :isLightTheme="isLightTheme"
            :autoCompleteData="autoCompleteData"
            @close="closeModal">
        </AddEditRuleModal>
    </div>
</template>