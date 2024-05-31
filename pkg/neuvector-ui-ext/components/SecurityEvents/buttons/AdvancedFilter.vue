<script>
    import AdvancedFilterModal from '../dialogs/AdvancedFilterModal';
    export default {
        components: {
            AdvancedFilterModal
        },
        props: {
            isLightTheme: Boolean
        },
        data() {
            return {
                showModal: false
            };
        },
        methods: {
            openAdvancedFilterDialog: function() {
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
        <AdvancedFilterModal v-if="showModal" :isLightTheme="isLightTheme" @close="closeModal"></AdvancedFilterModal>
    </div>
</template>