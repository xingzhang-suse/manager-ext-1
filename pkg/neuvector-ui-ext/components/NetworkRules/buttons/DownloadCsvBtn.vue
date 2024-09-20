<script>
    import { NV_MAP } from '../../../types/neuvector';
    import { arrayToCsv, parseDatetimeStr } from '../../../utils/common';
    import { saveAs } from 'file-saver';

    export default {
        components: {
        },
        props: {
            networkRules: Array,
        },
        methods: {
            exportCsv() {
                let reportData = this.networkRules.map((rule, index) => {
                    if (rule.id > 0) {
                        return {
                            sequence: index + 1,
                            id: rule.id,
                            comment: rule.comment,
                            from: rule.from,
                            to: rule.to,
                            applications: rule.applications,
                            ports: rule.ports,
                            action: rule.action,
                            type: NV_MAP.DISPLAY_CFG_TYPE_MAP[
                                rule.cfg_type.toLowerCase()
                            ],
                            status: rule.disable ? 'disabled' : 'enabled',
                            updated_at: parseDatetimeStr(rule.last_modified_timestamp * 1000, 'MMM DD, YYYY HH:mm:ss'),
                        };
                    }
                    return null;
                }).filter(row => !!row);
                
                let csv = arrayToCsv(reportData);
                let blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                saveAs(
                    blob,
                    `Network_rules_Reports_${parseDatetimeStr(new Date())}.csv`
                );
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-primary"
            aria-label="Save rules"
            type="button"
            @click="exportCsv()">
            CSV
        </a>
    </div>
</template>