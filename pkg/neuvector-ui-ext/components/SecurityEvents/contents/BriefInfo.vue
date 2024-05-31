<script>
    import GeneralBrief from './views/GeneralBrief';
    import SingleEndpointEventBrief from './views/SingleEndpointEventBrief';
    import DualEndpointsEventBrief from './views/DualEndpointsEventBrief';
    export default {
        components: {
            GeneralBrief,
            SingleEndpointEventBrief,
            DualEndpointsEventBrief
        },
        props: {
            index: Number,
            secEvent: Object,
        }
    };
</script>

<template>
    <div>
        <GeneralBrief :secEvent="secEvent"/>
        <DualEndpointsEventBrief v-if="
            secEvent.endpoint.source.id &&
            secEvent.endpoint.destination.id
            " :secEvent="secEvent"
            :index="index"
        />
        <SingleEndpointEventBrief v-else :secEvent="secEvent" :index="index"/>
    </div>
</template>