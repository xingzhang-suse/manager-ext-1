<script>
    export default {
        components: {
        },
        props: {
            exportPcap: Function
        }
    };
</script>

<template>
    <div>
        <a
            @click="exportPcap()"
            class="btn role-primary"
        >
            {{ t('general.PCAP_DOWNLOAD') }}
        </a>
    </div>
</template>