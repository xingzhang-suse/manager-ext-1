<script>
    export default {
        components: {
        },
        props: {
            rule: Object
        },
        computed: {
            getApplications() {
                if (this.rule && this.rule.applications && this.rule.id > -1) {
                    let app =
                        Array.isArray(this.rule.applications) &&
                        this.rule.applications.length > 0 &&
                        this.rule.applications[0] === 'any'
                            ? this.t('enum.ANY')
                            : this.rule.applications.join(', ');
                    return {
                        className: this.rule.remove ? 'policy-remove' : '',
                        text: app,
                    };
                }
                return {
                    className: '',
                    text: '-'
                };
            }
        }
    }
</script>

<template>
    <span :class="getApplications.className">{{ getApplications.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>