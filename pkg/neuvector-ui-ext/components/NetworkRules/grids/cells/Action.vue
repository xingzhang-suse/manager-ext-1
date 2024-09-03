<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
            action: String,
            id: Number,
        },
        computed: {
            getAction() {
                if (this.id > -1) {
                    return {
                        className: `${(this.disable ? NV_MAP.colourMap['disabled_background'] : NV_MAP.colourMap[this.action.toLowerCase()])} ${this.remove ? 'policy-remove' : ''}`,
                        text: this.t('policy.action.' + this.action.toUpperCase())
                    }
                }
                return '-';
            }
        }
    }
</script>

<template>
    <span :class="'action-label px-1 ' + getAction.className">{{ getAction.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>