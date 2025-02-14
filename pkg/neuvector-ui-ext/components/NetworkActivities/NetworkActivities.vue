<!-- <script>
    import { Graph } from '@antv/g6';
    import { onMounted, ref } from 'vue';

    const graphContainer = ref(null);

    export default {
        components: {
        },
        mounted() {
            const container = document.getElementById('network-graph');
            if (!container) {
                console.error('Container not found!');
                return;
            }
            const startTime = new Date('2023-08-01').getTime();
            const diff = 3600 * 24 * 1000;
            const timebarData = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
                time: new Date(startTime + index * diff),
                value: value,
                label: new Date(startTime + index * diff).toLocaleString(),
            }));
            const graphData = {
            nodes: new Array(49).fill(0).map((_, index) => ({
                id: `node-${index}`,
                data: {
                timestamp: startTime + (index % 10) * diff,
                value: index % 20,
                label: new Date(startTime + (index % 10) * diff).toLocaleString(),
                },
            })),
            edges: new Array(49).fill(0).map((_, i) => ({
                id: `edge-${i}`,
                source: `node-${i % 30}`,
                target: `node-${(i % 20) + 29}`,
                data: {
                edgeType: 'e1',
                },
            })),
            };

            const graph = new Graph({
                container: 'network-graph',
                data: graphData,
                behaviors: ['drag-canvas', 'drag-element', 'zoom-canvas'],
                layout: {
                    type: 'grid',
                    cols: 7,
                },
                plugins: [
                    {
                        type: 'timebar',
                        key: 'timebar',
                        data: timebarData,
                        width: 450,
                        height: 100,
                        loop: true,
                        timebarType: 'chart',
                    },
                ],
                autoFit: 'view',
                padding: [10, 0, 160, 0],
            });

            graph.render();
        },
        props: {
        },
        methods: {
        }
    };
</script>

<template>
    <div>
        Network Activities
    </div>
    <div id="network-graph" style="width: 800px; height: 600px;"  ref="graphContainer"></div>
</template> -->

<!-- <script>
    import { ref, onMounted } from "vue";
    import { Graph } from "@antv/g6"; // Import G6 Graph from package

    export default {
    name: "G6Graph",
    setup() {
        const graphContainer = ref(null);
        let graph = null; // Store the graph instance

        onMounted(() => {
            if (!graphContainer.value) {
            console.error("Graph container not found");
            return;
            }

            // Ensure container has dimensions
            graphContainer.value.style.width = "800px";
            graphContainer.value.style.height = "500px";

            const startTime = new Date('2023-08-01').getTime();
            const diff = 3600 * 24 * 1000;
            const timebarData = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
                time: new Date(startTime + index * diff),
                value: value,
                label: new Date(startTime + index * diff).toLocaleString(),
            }));
            const graphData = {
                nodes: new Array(49).fill(0).map((_, index) => ({
                    id: `node-${index}`,
                    data: {
                    timestamp: startTime + (index % 10) * diff,
                    value: index % 20,
                    label: new Date(startTime + (index % 10) * diff).toLocaleString(),
                    },
                })),
                edges: new Array(49).fill(0).map((_, i) => ({
                    id: `edge-${i}`,
                    source: `node-${i % 30}`,
                    target: `node-${(i % 20) + 29}`,
                    data: {
                    edgeType: 'e1',
                    },
                })),
            };

            // Initialize the graph
            graph = new Graph({
            container: graphContainer.value,
            width: graphContainer.value.clientWidth,
            height: graphContainer.value.clientHeight,
            data: graphData,
            behaviors: ['drag-canvas', 'drag-element', 'zoom-canvas'],
            layout: {
                type: 'grid',
                cols: 7,
            },
            plugins: [
                {
                    type: 'timebar',
                    key: 'timebar',
                    data: timebarData,
                    width: 450,
                    height: 100,
                    loop: true,
                    timebarType: 'chart',
                },
            ],
            autoFit: 'view',
            padding: [10, 0, 160, 0],
            defaultNode: {
                type: "circle",
                size: 50,
                style: {
                fill: "#5B8FF9",
                stroke: "#3D76DD",
                },
            },
            });

            // Render the graph
            graph.render();
        });

        return {
        graphContainer,
        };
    },
    };
</script>

<template>
    <div ref="graphContainer"></div>
</template>

<style scoped>
    #graph-container {
    border: 1px solid #ddd;
    }
</style> -->

<script>
import { ref, onMounted } from 'vue';
import { conversationData, getTimestampByYMD } from '../../utils/network-activities';
import icon1 from '../../assets/img/icons/graph/container.svg';
import { ExtensionCategory, Graph, Line, register } from '@antv/g6';



export default {
  name: "networkActivities",
  setup() {
    const graphContainer = ref(null);

    onMounted(() => {
      // Load G6 from CDN
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@antv/g6@latest/dist/g6.min.js";
        script.onload = () => {
            if (!window.G6) {
                console.error("G6 failed to load");
                return;
            }

            const G6 = window.G6;

            class AntLine extends G6.Quadratic {
                onCreate() {
                    const shape = this.shapeMap.key;
                    shape.animate([{ lineDashOffset: 20 }, { lineDashOffset: 0 }], {
                        duration: 500,
                        iterations: Infinity,
                    });
                }
            }

            G6.register(G6.ExtensionCategory.EDGE, 'ant-line', AntLine);


            // Ensure container is available
            if (!graphContainer.value) {
            console.error("Graph container not found");
            return;
            }

            // Ensure container has dimensions
            graphContainer.value.style.width = window.clientWidth;
            graphContainer.value.style.height = window.clientHeight;
            const timebarDataMap = new Map();
            conversationData.nodes.forEach(value => {
                let timestampByYMD = getTimestampByYMD(value.timestamp);
                if (timebarDataMap.has(timestampByYMD)) {
                    let timeData = timebarDataMap.get(timestampByYMD);
                    timebarDataMap.set(timestampByYMD, {
                        time: new Date(timestampByYMD * 1000),
                        value: timeData.value + 1,
                        label: new Date(timestampByYMD * 1000).toLocaleString(),
                    });
                } else {
                    timebarDataMap.set(timestampByYMD, {
                        time: new Date(timestampByYMD * 1000),
                        value: 1,
                        label: new Date(timestampByYMD * 1000).toLocaleString(),
                    });
                }
                
            });
            const timebarData = Array.from(timebarDataMap.values());
            
            console.log('timebarData', timebarData)
            const comboSet = new Set();
            conversationData.nodes = conversationData.nodes.map(node => {
                node.data = {
                    time: new Date(node.timestamp * 1000),
                    value: 1,
                    label: new Date(node.timestamp * 1000).toLocaleString(),
                };
                node.style = {
                    labelText: node.label
                };
                if (node.clusterId && node.group.startsWith('container')) {
                    comboSet.add(node.clusterId);
                    // node.combo = node.clusterId;
                }
                
                return node;
            });
            conversationData.edges = conversationData.edges.map(edge => {
                return edge;
            });
            // conversationData.combos = Array.from(comboSet).map(combo => {return {id: combo, style: {labelText: combo}}});
            const graphData = conversationData;

            console.log('graphData', graphData);
            const getContainerWidth = () => {
                const container = document.getElementById("graph-container");
                return container ? container.clientWidth - 200 : 800; // Default width if not found
            };
            const graph = new G6.Graph({
                container: graphContainer.value,
                width: graphContainer.value.clientWidth,
                height: graphContainer.value.clientHeight,
                data: graphData,
                node: {
                    size: 30,
                    style: {
                        stroke: '#65B2FF',
                        fill: '#fff',
                        labelFontSize: 10,
                        labelPlacement: 'bottom',
                        iconWidth: 50,
                        iconHeight: 50,
                        iconSrc: icon1,
                    },
                },
                edge: {
                    style: {
                        endArrow: true,
                        lineDash: [10, 10],
                    },
                    type: 'ant-line',
                    // type: 'quadratic',
                },
                behaviors: ['drag-canvas', 'drag-element', 'zoom-canvas', 'collapse-expand'],
                layout: {
                    type: 'fruchterman',
                    preventOverlap: true,
                    // preventOverlapPadding: 50,
                    // condense: true,
                    // clustering: true,
                    gravity: 0.4,
                    comboGravity: 0.1,
                    // comboSpacing: 100,
                    nodeSpacing: 100,
                    // comboStrength: 30,
                    // speed: 10,
                    animation: false,
                    maxIteration: 1000,
                },
                enabledStack: true,
                // combo: {
                //     type: 'circle',
                // },
                plugins: [
                    {
                        type: 'timebar',
                        key: 'timebar',
                        data: timebarData,
                        width: getContainerWidth(),
                        height: 100,
                        loop: true,
                        timebarType: 'chart',
                        onChange: (event) => {
                            const { value } = event;
                            console.log('timebar change', event)

                            // // Filter nodes & edges based on time
                            // graph.filterData((item) => item.data?.time <= value);

                            // // Explicitly reassign nodes to combos after filtering
                            // setTimeout(() => {
                            //     graph.getNodes().forEach(node => {
                            //         const model = node.getModel();
                            //         if (model.combo) {
                            //             graph.updateItem(node, { combo: model.combo });
                            //         }
                            //     });
                            //     graph.layout(); // Re-apply layout to reposition nodes in combos
                            // }, 100);
                        }
                    },
                ],
                autoFit: 'view',
                padding: [10, 0, 160, 0],
            });

            const toggleLabel = evt => {
                const { item } = evt;
                const model = item.getModel();
                const currentLabel = model.style.labelText;
                if (model.oriLabel !== currentLabel) {
                    item.update({
                        style:{labelText: model.label},
                    });
                    model.style.labelText = currentLabel;
                }
                console.log('hover')
                return item;
            };

            // Render the graph
            graph.render();

            // graph.on('node:pointerenter', evt => {
            //     const item = toggleLabel(evt);
            //     graph.setItemState(item, 'active', true);
            //     item.toFront();
            // });

            // graph.on('node:pointerleave', evt => {
            //     const item = toggleLabel(evt);
            //     graph.setItemState(item, 'active', false);
            // });

            graph.on("timebarchange", (event) => {
                const { value } = event;
                console.log('timebar change')

                // Filter nodes & edges based on time
                graph.filterData((item) => item.data?.time <= value);

                // Explicitly reassign nodes to combos after filtering
                setTimeout(() => {
                    graph.getNodes().forEach(node => {
                        const model = node.getModel();
                        if (model.combo) {
                            graph.updateItem(node, { combo: model.combo });
                        }
                    });
                    graph.layout(); // Re-apply layout to reposition nodes in combos
                }, 100);
            });

        };

        document.body.appendChild(script);
    });

    return {
      graphContainer,
    };
  },
};
</script>

<template>
  <div id="graph-container" ref="graphContainer"></div>
</template>

<style scoped>
    #graph-container {
        border: 1px solid #ddd;
    }
</style>
