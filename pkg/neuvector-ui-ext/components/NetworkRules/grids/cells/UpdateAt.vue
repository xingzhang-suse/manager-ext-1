<script>
    import { parseDatetimeStr } from '../../../../utils/common';
    export default {
        components: {
        },
        props: {
            rule: Object
        },
        computed: {
            getUpdateAt() {
                if (this.rule.last_modified_timestamp && this.rule && this.rule.id > -1) {
                    return {
                        className: this.rule.remove ? 'policy-remove' : '',
                        text: parseDatetimeStr(this.rule.last_modified_timestamp * 1000, 'MMM DD, YYYY HH:mm:ss'),
                    };
                }
                return '';
            }
        }
    }
</script>

<template>
    <span :class="getUpdateAt.className">{{ getUpdateAt.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>