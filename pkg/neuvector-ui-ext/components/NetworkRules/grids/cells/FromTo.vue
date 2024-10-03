<script>
    import { shortenString } from '../../../../utils/common';
    export default {
        components: {
        },
        props: {
            rule: Object,
            isFrom: Boolean
        },
        computed: {
            getFromTo() {
                if (this.rule && this.rule.id > -1) {
                    return {
                        className: this.rule.remove ? 'policy-remove' : '',
                        text: shortenString(this.isFrom ? this.rule.from : this.rule.to, 50),
                    };
                }
                return {
                    className: '',
                    text: this.isFrom ? this.rule.from : '',
                };
            }
        }
    }
</script>

<template>
    <span :class="getFromTo.className" v-tooltip.top="{
        content: isFrom ? rule.from : rule.to,
    }">{{ getFromTo.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>