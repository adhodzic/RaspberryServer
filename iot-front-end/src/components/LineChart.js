import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    watch: {
        chartData () {
            this.$data._chart.update()
        }
    },
    props: {
      chartdata: {
        type: Object,
        default: null
      },
      options: {
        type: Object,
        default: null
      }
    },
    mounted () {
      this.renderChart(this.chartdata, this.options);
    }
  }