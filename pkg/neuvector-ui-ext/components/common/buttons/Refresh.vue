<script>
    export default {
        components: {
        },
        props: {
            reloadData: Function
        },
        methods: {
            refresh: async function() {
                await this.reloadData();
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-secondary mx-2"
            aria-label="Refresh page data"
            type="button"
            @click="refresh()">
            <i class="icon icon-lg icon-backup"></i>
            <span class="ml-1">{{ t('general.REFRESH') }}</span>
        </a>
    </div>
</template>