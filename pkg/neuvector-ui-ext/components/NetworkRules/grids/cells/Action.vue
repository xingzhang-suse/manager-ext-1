<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
            rule: Object,
        },
        computed: {
            getAction() {
                if (this.rule && this.rule.id > -1) {
                    return {
                        className: `${(this.rule.disable ? NV_MAP.colourMap['disabled_background'] : NV_MAP.colourMap[this.rule.action.toLowerCase()])} ${this.rule.remove ? 'policy-remove' : ''}`,
                        text: this.t('policy.action.' + this.rule.action.toUpperCase())
                    }
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
    <span :class="'action-label px-1 ' + getAction.className">{{ getAction.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>