<script>
    import AsyncButton from '@shell/components/AsyncButton';
    import Loading from '@shell/components/Loading';
    import ButtonDropdown from '@shell/components/ButtonDropdown';
    import SimpleBox from '@shell/components/SimpleBox';
    import LabeledSelect from '@shell/components/form/LabeledSelect';
    import TopVulnerableNodesBarChart from './charts/TopVulnerableNodesBarChart.vue';
    import TopVulnerableImagesBarChart from './charts/TopVulnerableImagesBarChart.vue';
    import VulnerabilityItemsTable from './contents/VulnerabilityItemsTable.vue';
    import VulnerabilityItemsChart from './contents/VulnerabilityItemsChart.vue';
    import VulnerabilityItemsDetail from './contents/VulnerabilityItemsDetail.vue';
    import { postVulnerabilityQuery } from '../../plugins/vulnerabilities-class';
    import { SERVICE } from '@shell/config/types';
    import { nvVariables, NV_CONST, RANCHER_CONST } from '../../types';
    import { refreshAuth } from '../../plugins/neuvector-class'; 
    import { initVulQuery } from '../../utils/vulnerabilities';

    export default {
        components: {
            AsyncButton,
            Loading,
            ButtonDropdown,
            SimpleBox,
            LabeledSelect,
            TopVulnerableNodesBarChart,
            TopVulnerableImagesBarChart,
            VulnerabilityItemsTable,
            VulnerabilityItemsChart,
            VulnerabilityItemsDetail,
        },
        async fetch() {
            if ( this.$store.getters['cluster/canList'](SERVICE) ) {
                this.allServices = await this.$store.dispatch('cluster/findAll', { type: SERVICE }, { root: true });
                if ( Array.isArray(this.allServices) && this.allServices.length ) {
                    nvVariables.ns = this.allServices.find(svc => svc?.id?.includes(NV_CONST.NV_SERVICE)).metadata.namespace
                }
            }
            this.currentCluster = this.$store.getters['currentCluster'];
            nvVariables.currentCluster = this.currentCluster.id;
            try {
                console.log('Vulnerabilities');
                this.authRes = await refreshAuth();
                nvVariables.user = this.authRes.data.token;
                this.vulQueryData = (await postVulnerabilityQuery(this.vulQuery)).data;
                console.log(this.vulQueryData);
            } catch(error) {

            }
        },
        props: {
        },
        computed: {
            isLightTheme: function() {
                nvVariables.isLightTheme = sessionStorage.getItem(RANCHER_CONST.R_THEME) === RANCHER_CONST.THEME.LIGHT;
                return nvVariables.isLightTheme;
            }
        },
        data() {
            return {
                vulnerabilityViewsOptions: [ 
                    this.t('scan.report.view.ALL'), 
                    this.t('scan.report.view.CONTAINERS'), 
                    this.t('scan.report.view.INFRASTRUCTURE'),
                    this.t('scan.report.view.REGISTRY')
                ],
                selectedView: this.t('scan.report.view.ALL'),
                vulQuery: initVulQuery(),
                pieChartActive: false,
                selectedVul: null,
                vulQueryData: Object
            };
        },
        methods: {
            triggerRefresh() {
               this.$refs.refresh.$el.click();
            },
            togglePieChart(value) {
                this.pieChartActive = value;
            },
            setSelectedVul(selectedVul) {
                this.selectedVul = selectedVul;
            },
            async changeView(value) {
                this.selectedView = value;
                this.vulQuery.viewType = this.selectedView.toLowerCase();
                this.vulQueryData = (await postVulnerabilityQuery(this.vulQuery)).data;
                console.log(this.vulQueryData);
            },
            async refresh(buttonCb) {
                try {
                    this.vulQueryData = (await postVulnerabilityQuery(this.vulQuery)).data
                    buttonCb(true)
                } catch (err) {
                    buttonCb(false);
                }
            }
        }
    };
</script>

<template>
    <Loading v-if="$fetchState.pending" />
    <div v-else class="vulnerabilities">
        <div class="screen-area">
            <div id="scan" class="padding-top-0">
                <div class="clearfix">
                    <div class="fixed-header-actions">
                        <div class="bulk bulk d-flex align-items-center">
                            <h1 class="font-weight-light" id="vulnerabilities-title">
                                {{ t('sidebar.nav.SCAN') }}
                            </h1>
                            <LabeledSelect
                                class="view-select ml-15"
                                v-model="selectedView"
                                :close-on-select="true"
                                :multiple="false"
                                :label="t('scan.report.view.TITLE')"
                                :options="vulnerabilityViewsOptions"
                                @input="changeView"
                            />
                        </div>
                        <div class="search row">
                            <div>
                                <AsyncButton ref="refresh" :actionLabel="t('general.REFRESH')" :waitingLabel="t('general.REFRESHING')" :successLabel="t('general.REFRESH')" icon="icon-refresh" @click="refresh"></AsyncButton>
                            </div>
                        </div>
                    </div>
                    <div class="vul-charts">
                        <div>
                            <div class="mb-10 chart-title" style="line-height: 15px;">
                                <span class="mr-10">{{ t('scan.report.others.TOP_VULNERABLE_HOSTS') }}</span>
                            </div>
                            <TopVulnerableNodesBarChart :topVulHosts="vulQueryData.summary.top_nodes"/>
                            </div>
                            <div>
                            <div class="mb-10 chart-title" style="line-height: 15px;">
                                <span class="mr-10">{{ t('scan.report.others.TOP_VULNERABLE_IMAGES') }}</span>
                            </div>
                            <TopVulnerableImagesBarChart :topVulImages="vulQueryData.summary.top_images"/>
                        </div>
                    </div>
                    <SimpleBox class="mt-10">
                        <div class="grid-area">
                            <VulnerabilityItemsTable :isLightTheme="isLightTheme" :vulQueryData="vulQueryData" :vulQuery="vulQuery" @refresh="triggerRefresh" @togglePieChart="togglePieChart" @selectedVul="setSelectedVul"></VulnerabilityItemsTable>
                            <div v-if="selectedVul">
                                <VulnerabilityItemsChart :countDistribution="vulQueryData.summary.count_distribution" v-if="pieChartActive"></VulnerabilityItemsChart>
                                <VulnerabilityItemsDetail :selectedVul="selectedVul" :isLightTheme="isLightTheme" v-else></VulnerabilityItemsDetail>
                            </div>
                        </div>
                    </SimpleBox>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    @media print {
        @page {
            size: landscape;
            @bottom-right {
            content: counter(page) ' of ' counter(pages);
            }
        }
        .screen-area,
        #__layout nav,
        #__layout header {
            display: none;
            width: 0;
            height: 0;
        }
        // #__layout main {
        //   margin-top: 0;
        //   margin-bottom: 0;
        //   margin-left: 0;
        //   border: none;
        // }
        // .nv-section {
        //   border-top: none;
        //   padding-top: 4px;
        //   padding-bottom: 0;
        //   padding-left: 0;
        //   padding-right: 0;
        // }
        .printable-area {
            visibility: visible;
            position: absolute;
            top: 0;
            left: 0;
            overflow-y: auto;
            height: auto;
            width: 1000px;
        }
        .pagebreak {
            clear: both;
            page-break-after: always;
        }
    }
    @media screen {
        .printable-area {
            visibility: hidden;
            position: absolute;
            height: 0;
            overflow: hidden;
            width: 1000px;
        }
        .vul-charts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            grid-gap: 20px;

            .chart-title {
                display: flex;
                justify-content: center;
            }
        }
        .grid-area {
            display: grid;
            grid-template-columns: 60% 40%;
            grid-gap: 20px;
        }
        .view-select {
            max-width: 160px;
        }
    }
</style>