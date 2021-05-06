<template>
  <div class="sensor-template">
    <p>{{ sensorData.temp }}</p>
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
};
</script>

<style></style>
