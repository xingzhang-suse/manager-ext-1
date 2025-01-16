<script>
    import { parseDatetimeStr } from '../../../../utils/common';
    export default {
        components: {
        },
        props: {
        },
        computed: {
            getUpdateAt() {
                if (this.params.value && this.params.node.data && this.params.node.data.id > -1) {
                    return {
                        className: this.params.node.data.remove ? 'policy-remove' : '',
                        text: parseDatetimeStr(this.params.value * 1000, 'MMM DD, YYYY HH:mm:ss'),
                    };
                }
                return '';
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
    <span :class="getUpdateAt.className">{{ getUpdateAt.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>