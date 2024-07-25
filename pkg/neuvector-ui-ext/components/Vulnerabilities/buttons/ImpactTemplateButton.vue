<script>
    import ImpactIconTemplate from './components/ImpactIconTemplate.vue';

    export default {
        props: {
            content: Object,
            type: String
        },
        components: {
            ImpactIconTemplate,
        },
        methods: {
            openBrief(type, content) {
                if (['node', 'workload'].includes(type)) {
                    this.$emit('openBrief', {
                        type: type, 
                        id: content.id 
                    });
                }
            }
        }
    }
</script>

<template>
    <button
        v-if="!content.policy_mode"
        @click="openBrief(type, content)"
        class="border-0 badge ml-0 mr-5 mb-2 d-inline-flex justify-content-center align-items-center"
        style="background-color: black">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </button>
    <button
        v-else-if="content.policy_mode.toLowerCase() === 'discover'"
        @click="openBrief(type, content)"
        class="border-0 badge badge-danger ml-0 mr-5 mb-2 d-inline-flex justify-content-center align-items-center">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </button>
    <button
        v-else
        @click="openBrief(type, content)"
        class="border-0 badge badge-success ml-0 mr-5 mb-2 d-inline-flex justify-content-center align-items-center">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </button>
</template>

<style lang="scss" scoped>
.badge {
    border-radius: 4px;
}
</style>