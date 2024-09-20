<script>
    import AddEditRuleModal from '../dialogs/AddEditRuleModal';
    import { UpdateType } from '../../../types/network-rules';
    export default {
        components: {
            AddEditRuleModal,
        },
        props: {
            autoCompleteData: Object,
            isLightTheme: Boolean,
        },
        data() {
            return {
                UpdateType: UpdateType
            }
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
            :opType="UpdateType.AddToTop"
            @close="closeModal">
        </AddEditRuleModal>
    </div>
</template>