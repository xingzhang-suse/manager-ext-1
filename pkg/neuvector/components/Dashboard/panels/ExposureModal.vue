<template>
  <div class="modal-backdrop">
    <div class="modal">
      <Card :buttonAction="close" :buttonText="'Close'" :sticky="true">
        <template v-slot:title>
          <h5 class="p-10">
            {{ selectedRow.service }}
          </h5>
        </template>
        <template v-slot:body>
          <div class="p-10">
            <ExposureChildGrid :exposureInfo="selectedRow.children" exposureType="ingress" :rancherTheme="rancherTheme"/>
          </div>
          <!-- {{ selectedRow.children }} -->
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
  import { Card } from '@components/Card';
  import ExposureChildGrid from '../grids/ExposureChildGrid'

  export default {
    components: {
      Card,
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
    min-width: 600px;
    max-width: 1000px;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }
</style>