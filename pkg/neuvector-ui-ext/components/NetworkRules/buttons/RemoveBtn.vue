<script>
    export default {
        components: {
        },
        props: {
        },
        methods: {
            removeRules() {
                
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-secondary"
            aria-label="Remove rules"
            type="button"
            @click="removeRules()">
            {{ t('policy.toolBar.REMOVE') }}
        </a>
    </div>
</template>