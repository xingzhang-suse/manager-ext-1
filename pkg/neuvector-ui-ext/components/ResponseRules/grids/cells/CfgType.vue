<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
           cfgType: String,
           disable: Boolean,
        },
        computed: {
            getCfgType() {
                let typeClass = this.disable
                    ? NV_MAP.colourMap['disabled-rule']
                    : (
                    this.cfgType
                    ? NV_MAP.colourMap[this.cfgType]
                    : NV_MAP.colourMap[
                        this.rule.cfg_type ? this.rule.cfg_type : 'customer-rule'
                    ]
                    );
                let type = this.cfgType
                    ? NV_MAP.colourMap[this.cfgType]
                    : NV_MAP.colourMap[
                        this.rule.cfg_type ? this.rule.cfg_type : 'customer-rule'
                    ];

                return {
                    className: typeClass,
                    text: this.t(
                        `policy.head.${type.replace('-', '_').toUpperCase()}`
                    )
                };
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