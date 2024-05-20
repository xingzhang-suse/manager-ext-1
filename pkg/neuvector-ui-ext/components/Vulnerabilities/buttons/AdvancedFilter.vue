<script>
    import AdvancedFilterModal from '../dialogs/AdvancedFilterModal';
    import { nvVariables } from '../../../types/neuvector';
    export default {
        components: {
            AdvancedFilterModal
        },
        props: {
            isLightTheme: Boolean,
        },
        data() {
            return {
                showModal: false
            };
        },
        methods: {
            openAdvancedFilterDialog: function() {
                nvVariables.showAdvFilterModal.value = true;
                this.showModal = true;
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
            @click="openAdvancedFilterDialog()"
            class="btn role-primary"
        >
            {{ t('general.ADV_FILTER') }}
        </a>
        <!-- <AdvancedFilterModal v-if="showModal" :isLightTheme="isLightTheme" :autoCompleteData="autoCompleteData" @close="closeModal"></AdvancedFilterModal> -->
    </div>
</template>