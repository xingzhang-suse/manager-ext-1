<script>
    export default {
        components: {
        },
        props: {
        },
        computed: {
            getApplications() {
                if (this.params.node.data && this.params.value && this.params.node.data.id > -1) {
                    let app =
                        Array.isArray(this.params.value) &&
                        this.params.value.length > 0 &&
                        this.params.value[0] === 'any'
                            ? this.t('enum.ANY')
                            : this.params.value.join(', ');
                    return {
                        className: this.params.node.data.remove ? 'policy-remove' : '',
                        text: app,
                    };
                }
                return {
                    className: '',
                    text: '-'
                };
            }
        },
        methods: {
            refresh(params) {
                this.params = params
            }
        },
    }
</script>

<template>
    <span :class="getApplications.className">{{ getApplications.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>