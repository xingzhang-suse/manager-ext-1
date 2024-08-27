<script>
    import { NV_CONST } from '../../../types/neuvector';
    import { arrayToCsv, sortByOrder, parseDatetimeStr } from '../../../utils/common';
    import { saveAs } from 'file-saver';
    export default {
        components: {
        },
        props: {
            vulnerabilities: Array,
            csvFileName: String,
        },
        methods: {
            exportCSV: function() {
                let vuls = this.vulnerabilities.map(vulnerability => {
                    vulnerability.in_base_image = vulnerability.in_base_image || false;
                    vulnerability.description = `${vulnerability.description.replace(
                        /\"/g,
                        "'"
                    )}`;
                    vulnerability.tags = vulnerability.tags || '';
                    return vulnerability;
                });
                const csv = arrayToCsv(sortByOrder(vuls, NV_CONST.ORDERED_CVS_KEYS));
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const filename = `vulnerabilities-${this.csvFileName}_${parseDatetimeStr(
                new Date()
                )}.csv`;
                saveAs(blob, filename);
            }
        }
    };
</script>

<template>
    <div>
        <a
            mat-button
            class="btn role-primary"
            aria-label="Export node's vulnerabilties report CSV"
            type="button"
            @click="exportCSV()">
            CSV
        </a>
    </div>
</template>