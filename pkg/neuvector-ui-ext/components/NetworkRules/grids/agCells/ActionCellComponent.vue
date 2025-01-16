<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
        },
        computed: {
            getAction() {
                if (this.params.node.data && this.params.node.data.id > -1) {
                    return {
                        className: `${(this.params.node.data.disable ? NV_MAP.colourMap['disabled_background'] : NV_MAP.colourMap[this.params.value.toLowerCase()])} ${this.params.node.data.remove ? 'policy-remove' : ''}`,
                        text: this.t('policy.action.' + this.params.value.toUpperCase())
                    }
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
    <span :class="'action-label px-1 ' + getAction.className">{{ getAction.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>