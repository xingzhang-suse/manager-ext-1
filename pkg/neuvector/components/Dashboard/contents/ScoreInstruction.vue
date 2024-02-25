<template>
   <span v-if="scoreLevel === 'good'">
        <span>{{ t('dashboard.heading.guideline.MAIN_SCORE_GOOD1') }}</span>
        <span class="text-bold text-success">{{ t('dashboard.heading.guideline.MAIN_SCORE_GOOD') }}</span>
        <span>{{ t('dashboard.heading.guideline.MAIN_SCORE_GOOD2') }}</span>
   </span>
   <span v-else>
        <span>{{ t('dashboard.heading.guideline.MAIN_SCORE_NOT_GOOD1') }}</span>
        <span :class="scoreLevel === 'poor' ? 'text-bold nv-text-danger' : 'text-bold nv-text-warning'">{{ scoreLevel === 'poor' ? t('dashboard.heading.guideline.MAIN_SCORE_POOR') : t('dashboard.heading.guideline.MAIN_SCORE_FAIR')}}</span>
        <span>{{ t('dashboard.heading.guideline.MAIN_SCORE_NOT_GOOD2') }}</span>
   </span>
</template>
<script>
    export default {
        props: {
            score: Number
        },
        computed: {
            scoreLevel: function() {
                return this.score <= 20 ? 'good' :
                    this.score > 50 ? 'poor' : 'fair';
            },
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    .text-bold {
        font-weight: bold !important;
    }
    .nv-text-success {
        color: #009688;
    }
    .nv-text-warning {
        color: #ff9800;
    }
    .nv-text-danger {
        color: #f44336;
    }
</style>