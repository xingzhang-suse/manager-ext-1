<script>
    import { NV_CONST } from '../../../../types/neuvector';

    export default {
        components: {
        },
        computed: {
            getId() {
                if (this.params.node.data && this.params.node.data.id > -1) {
                    if (
                        this.params.node.data.remove &&
                        this.params.node.data.state !== NV_CONST.NETWORK_RULES_STATE.READONLY
                    ) {
                        return {
                            className: 'removed-rule',
                            text: this.params.value,
                        };
                    } else {
                        return {
                            className: '',
                            text: this.params.value,
                        };
                    }
                }
                return {
                    className: '',
                    text: ''
                }
            },
        },
        data() {
            return {
               nvConst: NV_CONST,
            };
        },
        methods: {
            refresh(params) {
                this.params = params
            }
        },
    }
</script>

<template>
    <span v-if="params.node.data.id >= nvConst.NEW_ID_SEED.NETWORK_RULE" :class="getId.className">{{'New-' + (parseInt(getId.text, 10) - nvConst.NEW_ID_SEED.NETWORK_RULE)}}</span>
    <span v-else :class="getId.className">{{ getId.text }}</span>
</template>

<style lang="scss" scoped>
    @import '../../../../styles/network-rules.scss';
</style>