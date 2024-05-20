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
                console.log(type, content);
            }
        }
    }
</script>

<template>
    <span
        v-if="!content.policy_mode"
        @click="openBrief(type, content)"
        class="border-0 badge text-white ml-0 mr-2 mb-2 d-inline-flex justify-content-center align-items-center"
        style="background-color: black">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </span>
    <button
        v-else-if="content.policy_mode.toLowerCase() === 'discover'"
        @click="openBrief(type, content)"
        class="border-0 badge badge-danger ml-0 mr-2 mb-2 d-inline-flex justify-content-center align-items-center">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </button>
    <button
        v-else
        @click="openBrief(type, content)"
        class="border-0 badge badge-success ml-0 mr-2 mb-2 d-inline-flex justify-content-center align-items-center">
        <ImpactIconTemplate :type="type"></ImpactIconTemplate>
        {{ content.display_name }}
    </button>
</template>