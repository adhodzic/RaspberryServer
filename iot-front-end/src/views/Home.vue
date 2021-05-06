<template>
  <div class="home">
    <h1 v-if="temp && date">Temperature: {{temp}} => Date: {{date}}</h1>
    <div class="small">
      <line-chart
      v-if="loaded"
      :chartdata="chartdata"
      :options="options"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import moment from 'moment'
import LineChart from '../components/LineChart'

export default {
  name: 'Home',
  components: {
      LineChart
  },
  data() {
    return {
      temp: null,
      date: null,
      loaded: false,
      chartData: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  methods: {
    async getTemp(){
      let res = await axios.get('http://192.168.5.19:8080/api/temp');
      console.log(res.data);
      this.temp = res.data.temp;
      this.date = moment.unix(res.data.unix).format("DD/MM/YYYY HH:mm:ss");
    },
    async getGraphTemp(){
      let res = await axios.get('http://192.168.5.19:8080/api/graph');
      return res.data;
    },
    async fillData () {
      let res = await axios.get('http://192.168.5.19:8080/api/graph');
      console.log([res.data.map(e =>{ return moment.unix(e.unix).format("HH:mm:ss")}), res.data.map(e =>{ return e.temp})])
      this.datacollection = {
        labels: res.data.map(e =>{ return moment.unix(e.unix).format("HH:mm:ss")}),
        datasets: [
          {
            label: "Temperature",
            backgroundColor: '#f87979',
            data: res.data.map(e =>{ return e.temp})
          },
        ]
      }
    },
  },
  async mounted() {
    this.loaded = false;
    setInterval(async ()=>{
      this.getTemp();
      try {
        let arr = await this.getGraphTemp()
        this.chartdata = {
          labels: arr.map(e => {return moment.unix(e.unix).format("HH:mm:ss")}),
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: '#f87979',
              data: arr.map(e => {return e.temp})
            }
          ]
        },
        this.loaded = true
      } catch (e) {
        console.error(e)
      }
    }, 5000);
  }
}
</script>

<style scoped>
 .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
