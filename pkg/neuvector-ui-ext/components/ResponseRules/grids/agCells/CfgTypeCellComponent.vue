<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
        },
        computed: {
            getCfgType() {
                let typeClass = this.params.data.disable
                    ? NV_MAP.colourMap['disabled-rule']
                    : (
                        this.params.value
                            ? NV_MAP.colourMap[this.params.value]
                            : NV_MAP.colourMap['customer-rule']
                    );
                let type = this.params.value
                    ? NV_MAP.colourMap[this.params.value]
                    : NV_MAP.colourMap['customer-rule'];
                return {
                    className: typeClass,
                    text: this.t(
                        `policy.head.${type.replace('-', '_').toUpperCase()}`
                    )
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
    <span :class="'type-label px-1 ' + getCfgType.className">{{ getCfgType.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>