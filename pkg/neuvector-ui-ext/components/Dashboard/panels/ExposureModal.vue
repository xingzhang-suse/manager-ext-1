<template>
  <div class="modal-backdrop">
    <div class="modal" :class="rancherTheme">
      <Card :buttonAction="close" :buttonText="'Close'" :sticky="true">
        <template v-slot:title>
          <h5 class="p-10" :style="rancherTheme === 'light' ? 'color: #888' : 'color: #fff'">
            {{ selectedRow.service }}
          </h5>
        </template>
        <template v-slot:body>
          <div class="p-10">
            <ExposureChildGrid :exposureInfo="selectedRow.entries" exposureType="ingress" :rancherTheme="rancherTheme"/>
          </div>
          <!-- {{ selectedRow.children }} -->
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
  import AsyncButton from '@shell/components/AsyncButton';
  import { Card } from '@components/Card';
  import ExposureChildGrid from '../grids/ExposureChildGrid'

  export default {
    components: {
      Card,
      AsyncButton,
      ExposureChildGrid
    },
    props: {
      selectedRow: Object,
      rancherTheme: String
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    min-width: 800px;
    max-width: 1000px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;

    &.light {
      background: #FFFFFF;
    }

    &.dark {
      background: #1b1c21;
    }

    & .card-container {
      margin: 0;
    }
  }
</style>