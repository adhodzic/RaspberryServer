<template>
  <div class="home">
    <h1 v-if="temp && date">Temperature: {{temp}} => Date: {{date}}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import moment from 'moment'
export default {
  name: 'Home',
  data() {
    return {
      temp: null,
      date: null
    }
  },
  methods: {
    async getTemp(){
      let res = await axios.get('http://192.168.5.19:8080/api/temp');
      console.log(res.data);
      this.temp = res.data.temp.split(":")[0];
      this.date = moment.unix(res.data.temp.split(":")[1]).format("DD/MM/YYYY HH:mm:ss");
    }
  },
  mounted() {
    setInterval(()=>{
      this.getTemp();
    }, 5000);
  },
}
</script>
