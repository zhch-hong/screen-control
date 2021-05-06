<template>
  <div class="app-container">
      <lx-button :init = "init">
      </lx-button>
      <div v-if="typeGroup == 'Charts'">
        <v-echarts :options="options" :functions="functions"></v-echarts>
      </div>
      <div v-if="typeGroup == 'ChinaCharts'">
          <map-echarts :options="options" :functions="functions"></map-echarts>
      </div>
      <div v-if="typeGroup == 'relationCharts'">
          <dragger-echarts :options="options" :functions="functions"></dragger-echarts>
      </div>
  </div>
</template>
<script>
import vEcharts from "./pie";
import mapEcharts from "./map";
import draggerEcharts from "./draggerEcharts.vue";
export default {
  components: { vEcharts,mapEcharts,draggerEcharts },
  data() {
    return {
      options: {},
      functions:{},
      typeGroup:""
    };
  },
  model: {
    prop: "data"
  },
  computed: {
    init(){
      return {
        query_param:{
          uuid: this.$route.query.uuid,
          type_uuid: this.$route.query.type_uuid
        },
        method: "getData"
      }
    }
  },
  methods: {
    getData(res) {
      if (res && res.code == 200) {
        if(res.data != null || res.data.length != 0){
          if(res.data.option != null && res.data.option.length != 0){
              this.options = res.data.option;
          }
          if(res.data.function != null && res.data.function.length != 0){
              this.functions = res.data.function;
          }
          this.typeGroup = res.data.type_group;
        }
      }
    }
  },
  mounted() {
     this.getData();
  }
};
</script>
