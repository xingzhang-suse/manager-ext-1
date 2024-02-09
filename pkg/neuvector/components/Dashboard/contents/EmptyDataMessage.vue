<script>
export default {
  components: {

  },
  props: {
    icon: String,
    color: String,
    message: String
  }
};
</script>

<template>
    <div>
        <i :class="icon" :style="'font-size: 40px;' + 'color:' + color"></i>
        <div :style="{'color': color}">{{ message }}</div>
    </div>
</template>

