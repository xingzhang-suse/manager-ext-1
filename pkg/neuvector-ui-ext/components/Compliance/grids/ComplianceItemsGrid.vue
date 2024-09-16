<template>
    <div>
      <ag-grid-vue
        id="agGrid"
        style="width: 100%; height: 235px"
        :class="isLightTheme ? 'ag-theme-balham' : 'ag-theme-balham-dark'"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
      >
      </ag-grid-vue>
    </div>
</template>
    
<script>
    import 'ag-grid-community/styles/ag-grid.css';
    import 'ag-grid-community/styles/ag-theme-balham.min.css';
    import { AgGridVue } from 'ag-grid-vue';
    import { arrayToCsv } from '../../../utils/common';
    import { complianceImpactComparator, getCsvData } from '../../../utils/compliance';
    import ComplianceCategoryCellComponent from './components/ComplianceCategoryCellComponent.vue';
    import ComplianceStatusCellComponent from './components/ComplianceStatusCellComponent.vue';
    import ComplianceImpactCellComponent from './components/ComplianceImpactCellComponent.vue';
    import ComplianceCSVCellComponent from './components/ComplianceCSVCellComponent.vue';
    import { saveAs } from 'file-saver';
    import dayjs from 'dayjs';

    export default {
        props: {
            complianceData: Object,
            advFilter: Object,
            filterText: String,
            isLightTheme: Boolean,
        },
        data() {
            return {
                columnDefs: null,
                gridOptions: null,
                gridApi: null,
            };
        },
        components: {
            AgGridVue,
            ComplianceCategoryCellComponent,
            ComplianceStatusCellComponent,
            ComplianceImpactCellComponent,
            ComplianceCSVCellComponent
        },
        beforeMount() {
            this.columnDefs = [
                {
                    headerName: this.t('cis.report.gridHeader.CATEGORY'),
                    field: 'category',
                    sortable: true,
                    resizable: true,
                    cellRenderer: 'ComplianceCategoryCellComponent',
                    cellRendererParams: {
                        kubeType: this.complianceData.kubernetes_cis_version,
                    },
                    cellClass: ['d-flex', 'align-items-center'],
                },
                {
                    headerName: this.t('cis.report.gridHeader.NAME'),
                    field: 'name',
                    sortable: true,
                    resizable: true,
                },
                {
                    headerName: this.t('responsePolicy.gridHeader.STATUS'),
                    field: 'level',
                    sortable: true,
                    resizable: true,
                    cellRenderer: 'ComplianceStatusCellComponent',
                },
                {
                    headerName: this.t('cis.report.gridHeader.SCORED'),
                    field: 'score',
                    sortable: true,
                    resizable: true,
                    valueFormatter: params => (params?.node?.data.scored ? 'Y' : 'N'),
                },
                {
                    headerName: this.t('cis.report.gridHeader.PROFILE'),
                    field: 'profile',
                    sortable: true,
                    resizable: true,
                },
                {
                    headerName: this.t('cis.report.gridHeader.IMPACT'),
                    colId: 'impact',
                    sortable: true,
                    resizable: true,
                    comparator: complianceImpactComparator,
                    cellRenderer: 'ComplianceImpactCellComponent',
                },
                {
                    headerName: 'CSV',
                    cellRenderer: 'ComplianceCSVCellComponent',
                    cellRendererParams: {
                        downloadCsv: event => this.downloadCsv(event),
                    },
                }
            ];

            this.gridOptions = {
                headerHeight: 30,
                rowHeight: 30,
                suppressDragLeaveHidesColumns: true,
                animateRows: true,
                rowSelection: 'single',
                onGridReady: params => {
                    this.gridApi = params.api;
                    this.gridApi.setRowData(this.complianceData.compliances);
                    setTimeout(() => {
                        this.gridApi.sizeColumnsToFit();
                    }, 300);
                    window.addEventListener('resize.#agGrid', () => {
                        setTimeout(() => {
                            this.gridApi.sizeColumnsToFit();
                        }, 100);
                    });
                },
                onModelUpdated: params => {
                    const firstRowNode = this.gridApi.getDisplayedRowAtIndex(0);
                    if (firstRowNode) {
                        firstRowNode.setSelected(true);
                    }
                },
                onSelectionChanged: params => {
                    this.$emit('togglePieChart', false);
                    if (params.api.getSelectedNodes()[0]) {
                        this.$emit('setSelectedCompliance', params.api.getSelectedNodes()[0].data);
                    }
                },
                overlayNoRowsTemplate: `<span class="overlay">No rows to show</span>`,
            };
        },
        methods: {
            downloadCsv(event) {
                let csv = arrayToCsv(getCsvData(event.node.data, this.advFilter));
                let blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, `${event.node.data.name}_${dayjs(new Date()).format('YYYYMMDDHHmmss')}.csv`);
            },
        },
        watch:  {
            filterText(newFilter, oldFilter) {
                console.log('new', newFilter, 'old', oldFilter);
                this.gridApi.setQuickFilter(newFilter);
                const filteredCount = this.gridApi.getModel()['rootNode'].childrenAfterFilter.length;
                this.$emit('setFilteredCount', filteredCount);
            },
        }
    };
</script>

<style scoped>
.flex-cell {
    display: flex;
    align-items: center;
}
</style>