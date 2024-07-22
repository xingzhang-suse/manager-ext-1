<script>
    import AdvancedFilterModal from '../dialogs/AdvancedFilterModal';
    import { nvVariables } from '../../../types/neuvector';
    export default {
        components: {
            AdvancedFilterModal
        },
        props: {
            isLightTheme: Boolean,
            advFilter: Object,
        },
        data() {
            return {
                showModal: false
            };
        },
        methods: {
            openAdvancedFilterDialog() {
                nvVariables.showAdvFilterModal.value = true;
                this.showModal = true;
            },
            closeModal(res) {
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
        <AdvancedFilterModal v-if="showModal" :isLightTheme="isLightTheme" :advFilter="advFilter" @close="closeModal"></AdvancedFilterModal>
    </div>
</template>