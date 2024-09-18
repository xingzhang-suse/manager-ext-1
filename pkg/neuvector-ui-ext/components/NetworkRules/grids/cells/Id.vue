<script>
    import { NV_CONST } from '../../../../types/neuvector';

    export default {
        components: {
        },
        props: {
            rule: Object,
        },
        computed: {
            getId() {
                if (this.rule && this.rule.id > -1) {
                    if (
                        this.rule.remove &&
                        this.rule.state !== NV_CONST.NETWORK_RULES_STATE.READONLY
                    ) {
                        return {
                            className: 'removed-rule',
                            text: this.rule.id,
                        };
                    } else {
                        return {
                            className: '',
                            text: this.rule.id,
                        };
                    }
                }
                return {
                    className: '',
                    text: '-'
                }
            },
        },
        data() {
            return {
               nvConst: NV_CONST,
            };
        },
    }
</script>

<template>
    <span v-if="rule.id >= nvConst.NEW_ID_SEED.NETWORK_RULE" :class="getId.className">{{'New-' + (parseInt(getId.text, 10) - nvConst.NEW_ID_SEED.NETWORK_RULE)}}</span>
    <span v-else :class="getId.className">{{ getId.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>