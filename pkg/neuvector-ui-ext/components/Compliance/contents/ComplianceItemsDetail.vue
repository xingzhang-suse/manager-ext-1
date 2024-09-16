<script>
    import { getNodeBriefById, getContainerBriefById } from '../../../plugins/vulnerabilities-class';
    import Tab from '@shell/components/Tabbed/Tab';
    import Tabbed from '@shell/components/Tabbed';

    export default {
        props: {
            selectedCompliance: Object,
            isLightTheme: Boolean
        },
        data() {
            return {
                showImpactModal: false,
                brief: {
                    type: null,
                    content: null
                },
            }
        },
        components: {
            Tab,
            Tabbed
        },
        methods: {
            openBrief({ type, id }) {
                if (type === 'node') {
                    getNodeBriefById(id).then(res => {
                        this.brief = {
                            type: 'node',
                            content: res.data.host
                        };
                        this.showImpactModal = true;
                    }).catch(err => {

                    });
                } else {
                    getContainerBriefById(id).then(res => {
                        let container = res.data.workload;
                        if (
                            container.labels &&
                            container.labels['io.kubernetes.container.name'] === 'POD'
                        ) {
                            container.images = [];
                        } else {
                            container.images = [container.image];
                        }
                        if (container.children && container.children.length > 0) {
                            container.children.forEach(child => {
                                container.images.push(child.image);
                            });
                        }
                        this.brief = {
                            type: 'workload',
                            content: container
                        }
                        this.showImpactModal = true;
                    }).catch(err => {

                    });
                }
            },
            closeImpact() {
                this.showImpactModal = false;
            }
        }
    }
</script>

<template>
    <Tabbed>
        <Tab name="remediation" :label="t('cis.REMEDIATION')" :weight="97">
            <div>
                <div class="text-dark" style="overflow: auto;">{{ selectedCompliance.description }}</div>
                <br />
                <span class="text-muted" style="overflow: auto;">{{ selectedCompliance.remediation }}</span>
            </div>
        </Tab>
        <Tab name="impact" :label="t('cis.report.gridHeader.IMPACT')" :weight="96">
            <div name="Pod">Pod tab content.</div>
        </Tab>
        <Tab name="regulations" :label="t('cis.profile.REGULATIONS')" :weight="95">
        </Tab>
    </Tabbed>
</template>

<style lang="scss" scoped>
</style>