<!-- CustomCell.vue -->
<template>
    <div class="d-flex">
        <div v-if="isParent" class="mr-1" @click.prevent="toggleVisible()">
            <i class="fa fa-minus-circle" v-if="isChildVisible"></i>
            <i class="fa fa-plus-circle" v-if="!isChildVisible"></i>
        </div>
        <div>
            <em v-if="!isParent" ></em>
            {{ name }}
        </div>
    </div>
  </template>
  
  <script>
  import { NV_CONST } from '../../../../types/neuvector';
  export default {
    props: {
      params: {
        data: Object
      },
    },
    created() {
       
    },
    methods: {
        agInit(params) {
            console.log("mounted", this.params)
            this.isParent = !this.params.data.parent_id && this.params.data.child_id;
            console.log("this.isParent", this.isParent);
            this.name = this.params.data.service;
            if (this.params.data.service)
                this.rowStyle = this.getServicePodStyle(this.params);
        },
        toggleVisible() {
            this.params.data.visible = !this.params.data.visible;
            this.params.data.child_ids.forEach(child_id => {
                const child_node = this.params.api.getRowNode(child_id);
                if (child_node) child_node.data.visible = !child_node.data.visible;
            });
            this.params.api.onFilterChanged();
        },
        getServicePodStyle(params) {
            const colorArray = [
                "text-danger",
                "text-warning",
                "text-caution",
                "text-monitor",
                "text-protect",
            ];
            const levelMap = {
                protect: 4,
                monitor: 3,
                discover: 2,
                violate: 1,
                warning: 1,
                deny: 0,
                critical: 0,
            };
            const actionTypeIconMap = {
                discover: "fa icon-size-2 fa-exclamation-triangle",
                violate: "fa icon-size-2 fa-ban",
                protect: "fa icon-size-2 fa-shield",
                monitor: "fa icon-size-2 fa-bell",
                deny: "fa icon-size-2 fa-minus-circle",
                threat: "fa icon-size-2 fa-bug",
            };

            let level = [];
            if (this.isParent) {
            if (this.params.data.severity) {
                level.push(levelMap[this.params.data.severity.toLowerCase()]);
            } else if (
                this.params.data.policy_action &&
                (this.params.data.policy_action.toLowerCase() === NV_CONST.POLICY_ACTION.DENY ||
                this.params.data.policy_action.toLowerCase() === NV_CONST.POLICY_ACTION.VIOLATE)
            ) {
                level.push(levelMap[this.params.data.policy_action.toLowerCase()]);
            } else {
                if (!this.params.data.policy_mode) this.params.data.policy_mode = NV_CONST.MODE.DISCOVER;
                level.push(levelMap[this.params.data.policy_mode.toLowerCase()]);
            }
            let serviceColor = colorArray[Math.min(...level)];
            return {
                color: serviceColor,
                actionIcon: ''
            };
            } else {
            let actionType = "";
            let level = 0;
            if (this.params.data.severity) {
                level = levelMap[this.params.data.severity.toLowerCase()];
                actionType = actionTypeIconMap[NV_CONST.POLICY_ACTION.THREAT];
            } else if (
                this.params.data.policy_action &&
                (this.params.data.policy_action.toLowerCase() === NV_CONST.POLICY_ACTION.DENY ||
                this.params.data.policy_action.toLowerCase() === NV_CONST.POLICY_ACTION.VIOLATE)
            ) {
                level = levelMap[this.params.data.policy_action.toLowerCase()];
                actionType =
                actionTypeIconMap[this.params.data.policy_action.toLowerCase()];
            } else {
                if (!this.params.data.policy_mode) this.params.data.policy_mode = NV_CONST.MODE.DISCOVER;
                level = levelMap[this.params.data.policy_mode.toLowerCase()];
                actionType =
                actionTypeIconMap[this.params.data.policy_mode.toLowerCase()];
            }
            return {
                color: colorArray[level],
                actionIcon: actionType
            };
            }
        }
    },


  };
  </script>
  
  <style scoped>
  /* Add your custom styles if needed */
  </style>