<script>
export default {
  components: {

  },

  props: {
    instructions: {
        textLines: [String]
    }
  }
};
</script>

<template>
  <div class="dropdown">
  <span class="icon"><i class="icon-info" /></span>
  
  <div class="dropdown-content">
    <div v-for="instruction in instructions.textLines">{{ instruction }}</div>
  </div>
</div>
</template>

<style lang="scss" scoped>
 /* Style the container */
 .dropdown {
    position: relative;
    display: inline-block;
}

/* Style the icon (change as needed) */
.icon {
    font-size: 24px;
    cursor: pointer;
    float: right;
}

/* Style the dropdown content */
.dropdown-content {
    display: none;
    position: absolute;
    top: 20px;
    background-color: #1f1f20;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 100;
    padding: 12px 16px;
}

/* Show the dropdown content on hover */
.icon:hover ~.dropdown-content {
    display: block;
}

/* Style the dropdown links (change as needed) */
.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

/* Add a background color to the dropdown links on hover */
.dropdown-content a:hover {
    background-color: #1f1f20;
}
</style>
