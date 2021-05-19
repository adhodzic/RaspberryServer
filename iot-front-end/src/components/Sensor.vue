<template>
  <div class="sensor">
    <p>{{ sensorData }}</p>
  </div>
</template>

<script>
export default {
  name: "Sensor",
  props: {
    sensorData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.sensorData);
  }
};
</script>

<style>
  .sensor{
    display: flex;
    flex-direction: row;
  }
</style>
