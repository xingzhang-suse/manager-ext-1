<script>
    import { Card } from '@components/Card';
    import Checkbox from '@components/Form/Checkbox/Checkbox';
    import { nvVariables } from '../../../types/neuvector';

    export default {
        components: {
            Card,
            Checkbox
        },
        props: {
            message: String,
            isQuarantined: Boolean,
            okFn: Function,
        },
        data() {
            return {
                isLightTheme: nvVariables.isLightTheme,
                unquarantine: false,
            };
        },
        methods: {
          close() {
            this.$emit('close');
          }
        }
    };
</script>

<template>
    <div class="modal-backdrop">
        <div class="modal" :class="isLightTheme ? 'light' : 'dark'"  style="position: absolute; z-index: 200; left: calc(100vw / 2 - 400px)">
            <Card :buttonAction="close" :buttonText="'Close'" :sticky="true">
                <template v-slot:title>
                    <h5 class="p-10" :style="isLightTheme ? 'color: #888' : 'color: #fff'">
                        {{ t('general.CONFIRMATION') }}
                    </h5>
                </template>
                <template v-slot:body>
                    <div>{{ message }}</div>
                    <div>
                        <Checkbox
                            v-if="isQuarantined"
                            v-model="unquarantine"
                            :label="t('responsePolicy.dialog.UNQUARANTINE_CHECK')"
                        />
                    </div>
                    <a
                        mat-button
                        class="btn role-primary mt-2"
                        aria-label="ok"
                        type="button"
                        style="width: 65px;"
                        @click="okFn(unquarantine)">
                        OK
                    </a>
                </template>
            </Card>
        </div>
    </div>
</template>