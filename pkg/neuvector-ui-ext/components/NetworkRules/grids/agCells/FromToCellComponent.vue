<script>
    import { shortenString } from '../../../../utils/common';
    export default {
        components: {
        },
        computed: {
            getFromTo() {
                if (this.params.node.data && this.params.node.data.id > -1) {
                    return {
                        className: this.params.node.data.remove ? 'policy-remove' : '',
                        text: shortenString(this.params.value, 50),
                    };
                }
                return {
                    className: '',
                    text: this.params.value,
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
    <span :class="getFromTo.className" v-tooltip.top="{
        content: params.value,
    }">{{ getFromTo.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>