<template>
  <div
    class="container"
    :style="{
      top: containerObservableStyle.top,
      left: containerObservableStyle.left,
      width: containerObservableStyle.width,
      height: containerObservableStyle.height,
      'border-width': containerObservableStyle.borderWidth,
    }"
  >
    <div class="header" :style="{ height: headerHeight }">
      <span>这里是标题区域</span>
    </div>
    <div class="main" :style="{ height: mainHeight }">
      <el-scrollbar style="height: 100%" wrapStyle="height: 100%; overflow-x: hidden;">
        <div ref="mountElement"></div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LanmuItem',

  data() {
    return {
      headerHeight: '40px',
      containerObservableStyle: {
        top: '',
        left: '',
        width: '',
        height: '',
        borderWidth: '',
      },
    };
  },

  computed: {
    mainHeight() {
      return (
        parseFloat(this.containerObservableStyle.height) -
        parseFloat(this.containerObservableStyle.borderWidth) * 2 -
        parseInt(this.headerHeight) +
        'px'
      );
    },
  },

  methods: {
    getMountElement() {
      return this.$refs.mountElement;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: absolute;
  box-sizing: border-box;
  border-style: solid;
  border-color: #f2f2f2;
  background-color: #fff;
  border-radius: 14px;
  overflow: hidden;

  .header {
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
  }

  .main {
    overflow: auto;
  }
}
</style>
