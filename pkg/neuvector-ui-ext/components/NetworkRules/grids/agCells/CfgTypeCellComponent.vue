<script>
    import { NV_MAP, NV_CONST } from '../../../../types/neuvector';
    export default {
        components: {
        },
        computed: {
            getCfgType() {
                if (this.params.node.data && this.params.node.data.id > -1) {
                    if (
                        this.params.node.data.remove &&
                        this.params.node.data.state !== NV_CONST.NETWORK_RULES_STATE.READONLY
                    ) {
                        return {
                            className: 'removed-rule',
                            text: this.t(
                                'policy.head.REMOVED_RULE'
                            )
                        };
                    } else {
                        let typeClass = this.params.node.data.disable
                            ? NV_MAP.colourMap['disabled-rule']
                            : (
                            this.params.node.data.state
                            ? NV_MAP.colourMap[this.params.node.data.state]
                            : NV_MAP.colourMap[
                                this.params.value ? this.params.value : 'customer-rule'
                            ]
                            );
                        let type = this.params.node.data.state
                            ? NV_MAP.colourMap[this.params.node.data.state]
                            : NV_MAP.colourMap[
                                this.params.value ? this.params.value : 'customer-rule'
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
        },
        methods: {
            refresh(params) {
                this.params = params
            }
        },
    }
</script>

<template>
    <span :class="'type-label px-1 ' + getCfgType.className">{{ getCfgType.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>