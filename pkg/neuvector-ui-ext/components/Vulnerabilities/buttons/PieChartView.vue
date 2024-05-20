<script>
    export default {
        data() {
            return {
                pieChartActive: false
            }
        },
        methods: {
            togglePieChart() {
                this.pieChartActive = !this.pieChartActive;
                this.$emit('togglePieChart', this.pieChartActive);
            }
        }
    };
</script>

<template>
    <div class="mr-10">
        <button @click="togglePieChart()" class="btn role-primary">
            <i class="icon icon-lg icon-circle-plus"></i>
        </button>
    </div>
</template>