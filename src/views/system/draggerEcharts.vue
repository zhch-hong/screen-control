<template>
  <div>
    <div ref="container" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script>
import draggerEcharts from "./js/draggerEcharts";

export default {
  name: "personRelation",
  data() {
    return {
      graph: {
        //这是数据项目中一般都是获取到的
        nodes: [],
        links: [],
      },
      categories: [],
    };
  },
  props: {
    height: { type: String, default: "80vh" },
    width: { type: String, default: "100%" },
    options: { type: Object },
    functions:{ type: Object}
  },
  computed: {
        myFunctions: function() {
      return this.functions || {};
    }
  },
  mounted() {
    this.drawLine();
  },
  watch: {
    options: {
      // immediate: true,
      deep: true,
      handler(v) {
        if (v) {
          this.drawLine();
        }
      },
    },
  },
  methods: {
    drawLine() {
      this.graph.links = this.options.links;
      this.graph.nodes = this.options.nodes;
      draggerEcharts(this.$refs.container, this.graph, this.options.categories);
    },
  },
};
</script>