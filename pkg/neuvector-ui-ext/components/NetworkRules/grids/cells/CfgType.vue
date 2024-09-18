<script>
    import { NV_MAP, NV_CONST } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
           rule: Object,
        },
        computed: {
            getCfgType() {
                if (this.rule && this.rule.id > -1) {
                    if (
                        this.rule.remove &&
                        this.rule.state !== NV_CONST.NETWORK_RULES_STATE.READONLY
                    ) {
                        return {
                            className: 'removed-rule',
                            text: this.t(
                                'policy.head.REMOVED_RULE'
                            )
                        };
                    } else {
                        let typeClass = this.rule.disable
                            ? NV_MAP.colourMap['disabled-rule']
                            : (
                            this.rule.state
                            ? NV_MAP.colourMap[this.rule.state]
                            : NV_MAP.colourMap[
                                this.rule.cfg_type ? this.rule.cfg_type : 'customer-rule'
                            ]
                            );
                        let type = this.rule.state
                            ? NV_MAP.colourMap[this.rule.state]
                            : NV_MAP.colourMap[
                                this.rule.cfg_type ? this.rule.cfg_type : 'customer-rule'
                            ];

                        return {
                            className: typeClass,
                            text: this.t(
                                `policy.head.${type.replace('-', '_').toUpperCase()}`
                            )
                        }
                    }

                }
                return {
                    className: '',
                    text: '-'
                }
            }
        }
    }
</script>

<template>
    <span :class="'type-label px-1 ' + getCfgType.className">{{ getCfgType.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>