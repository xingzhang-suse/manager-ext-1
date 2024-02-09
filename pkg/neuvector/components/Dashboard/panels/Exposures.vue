<script>
import BarChart4Exposures from '../charts/BarChart4Exposures';
import axios from 'axios';

export default {
    components: {
        BarChart4Exposures
    },

    async fetch() {
        let ipList = this.getIpList(this.ingress, this.egress);
        this.hierarchicalIngressList = null,
        this.hierarchicalEgressList = null
        axios({
            url: `../../api/v1/namespaces/${this.ns}/services/https:neuvector-service-webui:8443/proxy/ip-geo`,
            method: 'patch',
            headers: {
            token: this.token
            },
            data: ipList
        })
        .then(res => {
            this.hierarchicalIngressList = parseExposureHierarchicalData(
                this.addIpLocation(this.scoreInfo.ingress, ipMap, 'ingress')
            ) || [];
            this.hierarchicalEgressList = parseExposureHierarchicalData(
                this.addIpLocation(this.scoreInfo.egress, ipMap, 'egress')
            ) || [];
        })
        .catch(err => {});
    },

    methods: {
        getIpList: function(ingress, egress) {
            return ingress.flatMap(ingress => {
                return ingress.entries ? ingress.entries.map(entry => entry.client_ip) : [];
            }).concat(egress.flatMap(egress => {
                return egress.entries ? egress.entries.map(entry => entry.server_ip) : [];
            }));
        },
        groupBy: function(arr, key) {
            return arr.reduce((groups, item) => {
                (groups[item[key]] ||= []).push(item);
                return groups;
            }, {});
        },
        parseExposureHierarchicalData: function(exposure) {
            let hierarchicalExposures = [];
            if (exposure.length === 0) return hierarchicalExposures;
            let groupedExposure = this.groupBy(exposure, 'service');

            Object.entries(groupedExposure).forEach(([k, v]) => {
                let applicationSet = new Set();
                v.forEach(child => {
                if (child.applications) {
                    child.applications.forEach(app => {
                    applicationSet.add(app);
                    });
                }
                if (child.ports) {
                    child.ports.forEach(port => {
                    applicationSet.add(port);
                    });
                }
                });
                let hierarchicalExposure = {
                workload_id: '',
                peerEndpoint: '',
                service: k,
                policy_mode: v[0].policy_mode,
                workload: '',
                bytes: 0,
                sessions: 0,
                severity: '',
                policy_action: '',
                event_type: '',
                protocols: '',
                applications: Array.from(applicationSet),
                ports: [],
                entries: summarizeEntries(v),
                children: v.map(child => ({
                    ...child,
                    service: '',
                })),
                };
                hierarchicalExposures.push(
                JSON.parse(JSON.stringify(hierarchicalExposure))
                );
            });
            return hierarchicalExposures;
        }
    },

    props: {
        token: String,
        ns: String,
        ingress: Array,
        egress: Array
    },

    data() {
        return {
            ipMap: null,
            hierarchicalIngressList: null,
            hierarchicalEgressList: null
        }
    },

    computed: {
        
    }
};
</script>

<template>
    <!-- <BarChart4Exposures :hierarchicalExposures="hierarchicalExposures"/> -->
    <!-- <Tabbed defaultTab="">
        <Tab name="ingress" :label="t('dashboard.body.panel_title.INGRESS')">
            <ExposureGrid :exposureInfo="scoreInfo.ingress" exposureType="ingress"/>
        </Tab>
        <Tab name="egress" :label="t('dashboard.body.panel_title.EGRESS')">
            <ExposureGrid :exposureInfo="scoreInfo.egress" exposureType="egress"/>
        </Tab>
    </Tabbed> -->
</template>