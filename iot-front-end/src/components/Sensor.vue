<template>
  <div @click="sensorClicked()" v-bind:class="{collapsed: isCollapsed}" v-if="sensorData.addr != null" class="sensor-template">
    <div class="sensor-header">
      <i v-bind:class="{rotate: isCollapsed}" class="fas fa-chevron-down" style="align-self: center;"></i>
      <p>{{ sensor_enum[sensorData.addr] }}</p>
      <div class="signal">
        <img v-if="sensorData.sig > 0 && sensorData.sig <= 25" class="image" src="../assets/wireless-1.svg">
        <img v-if="sensorData.sig > 25 && sensorData.sig <= 50" class="image" src="../assets/wireless-2.svg">
        <img v-if="sensorData.sig > 50 && sensorData.sig <= 75" class="image" src="../assets/wireless-3.svg">
        <img v-if="sensorData.sig > 75" class="image" src="../assets/wireless-4.svg">
      </div>
    </div>
    <transition name="fade">
      <div class="sensor-footer" v-if="isCollapsed">
          <p>{{sensorData.temp}} °C</p>
          <p v-if="sensorData.hum != 255">{{sensorData.hum}} %</p>
      </div>
     </transition>
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
      last: "...",
      sensor_enum: {
        5: 'Home',
        6: 'Garden'
      },
      isCollapsed: false
    };
  },
  watch: {
    'sensorData.unix': function (val) {
      this.last = Math.round((Date.now() / 1000) - parseInt(val));
    }
  },
  methods:{
    sensorClicked(){
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>

<style>
.fa-chevron-down {
  transform: rotate(-90deg);
  transition: transform .5s;
}
.rotate {
  transform: rotate(0deg);
}
.fade-enter-active {
  transition: opacity 0.5s ease-in-out 0.1s;
}
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.signal {
  display: flex;
  flex-direction: row;
}
.sensor-template {
  padding-left: 2rem;
  padding-right: 2rem;
  height: 3rem;
  transition: height 0.5s;

  
}
.sensor-template p {
  font-weight: bold;
}
.sensor-template:hover{
  background-color: rgb(92, 0, 134);
  color: rgb(255, 1, 255);
}
.sensor-header{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}
.sensor-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  height: 3rem;
}
.sensor-footer p{
  margin-left: 1rem;
  margin-right: 1rem;
}
.collapsed{
  height: 6rem;
}
.image{
  margin-left: 10px;
  margin-bottom: 0px;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-self: center;
}
</style>
