<script>
    import AdvancedFilter from '../buttons/AdvancedFilter.vue';
    import PieChartView from '../buttons/PieChartView.vue';
    import QuickFilter from '../quickFilter/QuickFilter.vue';
    import ComplianceItemsGrid from '../grids/ComplianceItemsGrid.vue';
    import { initCompFilter } from '../../../utils/compliance';

    export default {
        components: {
            AdvancedFilter,
            PieChartView,
            QuickFilter,
            ComplianceItemsGrid
        },
        props: {
            complianceData: Object,
            availableFilters: Array,
            isLightTheme: Boolean,
        },
        data() {
            return {
                filterText: '',
                filteredCount: null,
                advFilter: this.initFilter(),
            }
        },
        computed: {
            totalCount() {
                return this.complianceData.compliances.length;
            }
        },
        methods: {
            initFilter() {
                let advFilter = initCompFilter();
                if (this.availableFilters) {
                    advFilter.tags = this.availableFilters.reduce(
                        (acc, curr) => ({ ...acc, [curr]: false }),
                        {}
                    )
                }
                return advFilter;
            },
            setQuickFilter(filterText) {
                this.filterText = filterText;
            },
            togglePieChart(pieChartActive) {
                this.$emit('togglePieChart', pieChartActive);
            },
            setSelectedCompliance(selectedCompliance) {
                this.$emit('setSelectedCompliance', selectedCompliance);
            },
            setFilteredCount(filteredCount) {
                this.filteredCount = filteredCount;
            },
            openAdvFilter() {
                return;
            }
        },
    };
</script>

<template>
    <div>
        <div class="fixed-header-actions">
            <div class="bulk bulk flex center">
                <span class="d-block font-weight-bold text-info">
                    <span v-if="filteredCount && filteredCount !== totalCount">
                        {{ t('enum.FOUND') }} {{ filteredCount }}&nbsp;/
                    </span>
                    <span v-else>
                        {{ t('enum.OUT_OF') }}&nbsp;
                    </span>
                    {{ totalCount }}
                </span>
            </div>
            <div class="middle">
                <div class="flex">
                    <PieChartView @togglePieChart="togglePieChart"></PieChartView>
                    <AdvancedFilter @openAdvFilter="openAdvFilter"></AdvancedFilter>
                </div>
            </div>
            <div class="search row">
                <QuickFilter @quickFilter="setQuickFilter" class="w-auto mr-10"></QuickFilter>
            </div>
        </div>
        <ComplianceItemsGrid 
            :isLightTheme="isLightTheme" 
            :filterText="filterText" 
            :advFilter="advFilter" 
            :complianceData="complianceData" 
            @togglePieChart="togglePieChart" 
            @setSelectedCompliance="setSelectedCompliance" 
            @setFilteredCount="setFilteredCount">
        </ComplianceItemsGrid>
    </div>
</template>

<style lang="scss" scoped>
.flex {
    display: flex;
    &.center {
        align-items: center;
    }
}
</style>