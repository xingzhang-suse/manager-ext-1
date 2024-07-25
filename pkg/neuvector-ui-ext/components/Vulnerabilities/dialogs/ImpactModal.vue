<script>
    import { Card } from '@components/Card';
    import Checkbox from '@components/Form/Checkbox/Checkbox';
    import IconCheckboxBlank from '../../common/icons/CheckboxBlank.vue';
    import IconStorage from '../../common/icons/Storage.vue';
    import ImpactModalWorkloadBrief from './components/ImpactModalWorkloadBrief.vue';
    import ImpactModalNodeBrief from './components/ImpactModalNodeBrief.vue';

    export default {
        components: {
            Card,
            Checkbox,
            IconCheckboxBlank,
            IconStorage,
            ImpactModalWorkloadBrief,
            ImpactModalNodeBrief,
        },
        props: {
            isLightTheme: Boolean,
            type: String,
            content: Object,
        },
        methods: {
            close() {
                this.$emit("close");
            },
        },
        data() {
            return {
                
            };
        },
    };
</script>

<template>
    <div class="modal-backdrop">
        <div class="modal" :class="isLightTheme ? 'light' : 'dark'">
            <Card
            :buttonAction="close"
            :buttonText="t('general.CLOSE')"
            :sticky="true"
            >
                <template v-slot:title>
                    <h5
                    class="p-10"
                    :style="isLightTheme ? 'color: #888' : 'color: #fff'"
                    >
                        <template v-if="type === 'workload'">
                            <IconCheckboxBlank></IconCheckboxBlank>
                            {{ content.display_name }}
                        </template>
                        <template v-else>
                            <IconStorage></IconStorage>
                            {{ content.name }}
                        </template>
                    </h5>
                </template>
                <template v-slot:body>
                    <ImpactModalWorkloadBrief :workload="content" v-if="type === 'workload'"></ImpactModalWorkloadBrief>
                    <ImpactModalNodeBrief :host="content" v-else></ImpactModalNodeBrief>
                </template>
            </Card>
        </div>
    </div>
</template>
