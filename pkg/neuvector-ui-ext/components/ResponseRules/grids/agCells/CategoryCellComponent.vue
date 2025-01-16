<script>
    import { NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
        },
        props: {
           eventType: String,
           disable: Boolean,
        },
        computed: {
            getCategory() {
                return {
                    className: this.params.data.disable
                        ? NV_MAP.colourMap['disabled_background']
                        : NV_MAP.colourMap[ this.params.value.toLowerCase()],
                    text: this.t('responsePolicy.categories.' +  this.params.value.toUpperCase()),
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
    <span :class="'type-label type-label-lg ' + getCategory.className">{{ getCategory.text }}</span>
</template>

<style lang="scss" scoped>
@import '../../../../styles/network-rules.scss';
</style>