<template>
  <div class="sensor-template">
    <p>Temperature: {{ sensorData.temp }}</p>
    <p>Humidity: {{ sensorData.hum }}</p>
    <p>ID: {{ sensorData.addr }}</p>
    <p>Updated: {{ last }} s</p>
    <div class="signal">
      <p>{{sensorData.sig}}</p>
      <img src="../assets/signal-full.svg">
      <div v-if="sensorData.sig < -40"></div>
      <div v-if="sensorData.sig >= -50 && sensorData.sig < -60"></div>
      <div v-if="sensorData.sig >= -60 && sensorData.sig < -70"></div>
      <div v-if="sensorData.sig >= -70 && sensorData.sig < -80"></div>
      <div v-if="sensorData.sig >= -80"></div>
    </div>
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
    return {
      last: "..."
    };
  },
  watch: {
    'sensorData.unix': function (val) {
      this.last = Math.round((Date.now() / 1000) - parseInt(val));
    }
  }
};
</script>

<style>
.cone-full {
  align-self: center;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 25px solid red;
  border-radius: 50%;
}
.cone-4 {
  align-self: center;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid red;
  border-radius: 50%;
}
.cone-3 {
  align-self: center;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 25px solid red;
  border-radius: 50%;
}
.cone-2 {
  align-self: center;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 25px solid red;
  border-radius: 50%;
}
.cone-1 {
  align-self: center;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 25px solid red;
  border-radius: 50%;
}
.signal {
  display: flex;
  flex-direction: row;
}
.sensor-template {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.sensor-template p {
  font-weight: bold;
}
</style>
