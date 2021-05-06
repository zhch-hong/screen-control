//map.vue

<template>          
    <div>
        <div ref="myEchart" :style="{height:height,width:width}"></div>
    </div>
</template>
        
<script>
    //import option from './map-option'  //引入配置项
    require('./js/china')  //引入china.js地图文件
    import * as echarts from "echarts";
    export default {
   
  name: "echarts",
  data() {
    return {
      myChart:undefined
    };
  },
  props: {
    height: { type: String, default: "80vh" },
    width: { type: String, default: "100%" },
    options: { type: Object },
    functions:{ type: Object}
  },
  computed: {
    myOptions: function() {
      return this.options || {};
    },
    myFunctions: function() {
      return this.functions || {};
    }
  },
  mounted() {
    this.drawLine();
  },
  watch:{
    options: {
      handler(v) {
        if (v) {
          this.drawLine();
        }
      }
    }
  },
  //ECharts4 开始，除了默认主题外，内置了两套主题，分别为 light 和 dark
  methods: {
    drawLine() {
      let these  = this;
      this.myChart = echarts.init(this.$refs.myEchart);
      this.myChart.setOption(this.myOptions); // 绘制图表
      this.myFunctions.forEach(function(fun){
        var square3 = new Function("these",fun.function);
          these.myChart.on(fun.event_type,function(param){
            these.param = param;
            square3(these)
          })
      })
      //将方法myChart.resize(); 赋予给 window.onresize
      window.onresize = () => this.myChart.resize();
      //重绘
      window.addEventListener("resize", () => this.myChart.resize());
    }
  }
    }
</script>