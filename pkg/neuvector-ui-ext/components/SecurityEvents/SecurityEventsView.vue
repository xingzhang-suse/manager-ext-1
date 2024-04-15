<script>
    import Refresh from './buttons/Refresh.vue';
    import { getSecEvents } from '../../plugins/security-events-class';
    import { combineSecurityEvents } from '../../utils/security-events';
    import { SERVICE } from '@shell/config/types';
    import { nvVariables, NV_CONST } from '../../types/neuvector';
    import { refreshAuth } from '../../plugins/neuvector-class'; 

    export default {
        components: {
            Refresh
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
                console.log('Security Events');
                this.authRes = await refreshAuth();
                nvVariables.user = this.authRes.data.token;
                this.secEvents = await getSecEvents();
                console.log(this.secEvents, this.t);
                let processedSecEvents = await combineSecurityEvents(this.secEvents, this.$store);
                console.log(processedSecEvents);
            } catch(error) {

            }
        },
        props: {
        },
        computed: {
            displayedSecurityEvents: function() {

            }
        },
        data() {
            return {
                secEvents: Object,
                processedSecEvents: Object
            };
        }
    };
</script>

<template>
    <div class="screen-area">
        <div id="sec-event" class="padding-top-0">
            <div class="clearfix">
            <Refresh />
            <!-- <ng-container
                *ngIf="securityEventsService.displayedSecurityEvents.length > 0">
                <div class="d-flex pull-right">
                    <button
                        mat-button
                        aria-label="Export secutiry events reports CSV"
                        type="button"
                        (click)="exportCSV()">
                        <i class="eos-icons icon-18">csv_file</i>
                    </button>
                </div>
            </ng-container> -->

            <h1 class="font-weight-light" id="security-events-title">
                {{ t('sidebar.nav.SECURITY_EVENT') }}
            </h1>
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
    }
</style>