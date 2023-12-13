<template>
    <ag-grid-vue
      style="width: 500px; height: 200px"
      class="ag-theme-quartz"
      :columnDefs="columnDefs"
      :rowData="rowData"
    >
    </ag-grid-vue>
  </template>
  
  <script>
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-quartz.css";
  import { AgGridVue } from "ag-grid-vue";
  
  export default {
    name: "App",
    data() {
      return {
        columnDefs: null,
        rowData: null,
      };
    },
    components: {
      AgGridVue,
    },
    beforeMount() {
      this.columnDefs = [
        { field: "make" },
        { field: "model" },
        { field: "price" },
      ];
  
      this.rowData = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 },
      ];
    },
  };
  </script>