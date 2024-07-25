<script>
    import ButtonDropdown from '@shell/components/ButtonDropdown';

    export default {
        components: {
            ButtonDropdown,
        },
        data() {
            return {
                scoreOptions: [ 
                    this.t('scan.report.data.V2'), 
                    this.t('scan.report.data.V3')
                ],
                selectedScore: this.t('scan.report.data.V3')
            }
        },
        methods: {
            changeScore(value) {
                this.selectedScore = value;
                this.$emit('setSelectedScore', this.selectedScore);
            }
        }
    };
</script>

<template>
    <div class="mr-10">
        <ButtonDropdown
            :buttonLabel="selectedScore"
            :value="selectedScore"
            :dropdownOptions="scoreOptions" 
            size="sm"
            @click-action="changeScore" 
        />
    </div>
</template>