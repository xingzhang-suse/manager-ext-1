<script>
    import AddEditRuleModal from '../dialogs/AddEditRuleModal';
    import { UpdateType } from '../../../types/network-rules';
    export default {
        components: {
            AddEditRuleModal,
        },
        props: {
            autoCompleteData: Object,
            webhooks: Array,
            source: String,
            isLightTheme: Boolean,
            refreshFn: Function,
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
            class="btn role-secondary"
            aria-label="Open add rule modal"
            type="button"
            @click="openAddEditRuleModal()">
            {{ t('policy.toolBar.INSERT_TO_TOP') }}
        </a>
        <AddEditRuleModal 
            ref="addEditRule"
            :isLightTheme="isLightTheme"
            :autoCompleteData="autoCompleteData"
            :webhooks="webhooks"
            :source="source"
            :opType="UpdateType.AddToTop"
            :refreshFn="refreshFn"
            @close="closeModal">
        </AddEditRuleModal>
    </div>
</template>