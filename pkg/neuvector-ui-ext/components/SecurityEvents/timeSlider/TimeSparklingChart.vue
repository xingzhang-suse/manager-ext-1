<script>
    import { Line as LineChartGenerator } from 'vue-chartjs/legacy';
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        CategoryScale,
        PointElement
    } from 'chart.js';
    import { parseDatetimeStr, getDateByInterval, parseLocalDate, groupBy, getDuration } from '../../../utils/common';

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        CategoryScale,
        PointElement
    )

    export default {
        name: 'lineChart',
        components: {
            LineChartGenerator
        },
        props: {
            chartId: {
                type: String,
                default: 'line-chart'
            },
            datasetIdKey: {
                type: String,
                default: 'label'
            },
            width: {
                type: Number,
                default: 100
            },
            height: {
                type: Number,
                default: 60
            },
            cssClasses: {
                default: '',
                type: String
            },
            styles: {
                type: Object,
                default: () => {}
            },
            plugins: {
                type: Array,
                default: () => {}
            },
            securityEventsList: Array
        },
        computed: {
            chartData: function() {
                console.log('chart data...');
                let securityEventsLineChartData = [];
                let secEventByReportDate = groupBy(this.securityEventsList, 'reportedOn');
                let earliestDateStr = parseLocalDate(
                    this.securityEventsList[
                        this.securityEventsList.length - 1
                    ].orgReportedAt
                );
                let nowDateObj = new Date();
                let nowDateStr = parseDatetimeStr(nowDateObj, 'YYYYMMDD');
                let date = earliestDateStr;
                let startDate = date;
                let maxTimeGap = getDuration(
                    nowDateStr,
                    earliestDateStr
                );
                for (
                    ;
                    date <= nowDateStr;
                    date = getDateByInterval(
                        `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`,
                        1,
                        "day").substring(0, 8)
                ) {
                    securityEventsLineChartData.push(
                        secEventByReportDate.hasOwnProperty(date)
                        ? secEventByReportDate[date].length
                        : 0
                    );
                }
                if (maxTimeGap === 0) {
                    securityEventsLineChartData.push(
                        secEventByReportDate.hasOwnProperty(startDate)
                        ? secEventByReportDate[startDate].length
                        : 0
                    );
                }
                console.log("securityEventsLineChartData", securityEventsLineChartData);
                return {
                    labels: new Array(securityEventsLineChartData.length).fill(''),
                    datasets: [
                        {
                            data: securityEventsLineChartData,
                            pointRadius: 0,
                            backgroundColor: 'rgba(25, 75, 32, 0.2)',
                            borderColor: '#194b20',
                            hoverBackgroundColor: 'rgba(25, 75, 32, 0.2)',
                            hoverBorderColor: '#194b20',
                            fill: true,
                            tension: 0.2,
                        },
                    ]
                }
            }
        },
        data() {
            return {
                chartOptions: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                    x: {
                        grid: {
                        display:false
                        },
                        ticks: {
                        display: false
                        }
                    },
                    y: {
                        grid: {
                        display:false
                        }
                    }
                    },
                    layout: {
                    autoPadding: false
                    },
                    plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    }
                    } 
                }
            };
        }
    };
</script>

<template>
     <LineChartGenerator
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>