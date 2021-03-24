<template>
  <div class="page-list" @drop="ondrop" @dragover="ondragover" @dragenter="ondragenter" @dragleave="ondragleave">
    <div ref="DRAGGABLE" class="drag" draggable="true" @drag="ondrag" @dragstart="ondragstart" @dragend="ondragend">
      page-list
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

let offsetX = 0,
  offsetY = 0;

export default {
  mounted() {
    const el = this.$refs.DRAGGABLE;
    el.onresize = (e) => {
      console.log(10);
    };
  },

  methods: {
    // ------------------------ 拖拽元素

    /**
     * 开始
     */
    ondragstart(e) {
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      // console.log(top, left, e.clientX, e.clientY);
    },

    /**
     * 移动
     */
    ondrag(e) {
      // console.log('drag');
    },

    /**
     * 结束
     */
    ondragend(e) {
      e.target.style.top = e.clientY - offsetY + 'px';
      e.target.style.left = e.clientX - 180 - offsetX + 'px';
      // console.log('dragend');
      // console.log(e.target.style, e.target.style);
      // console.log('offset', e.offsetX, e.offsetY);
      // console.log('client', e.clientX, e.clientY);
      // e.target.style.top = e.offsetY + 'px';
      // e.target.style.left = e.offsetX + 'px';
    },

    // ------------------------ 放置区域

    /**
     * 进入
     */
    ondragenter(e) {
      e.preventDefault();
      // console.log('dragenter');
    },

    /**
     * 离开
     */
    ondragleave(e) {
      e.preventDefault();
      // console.log('dragleave');
    },

    /**
     * 移动
     */
    ondragover(e) {
      e.preventDefault();
      // console.log('dragover');
    },

    /**
     * 完成
     */
    ondrop(e) {
      e.preventDefault();
      // console.log('drop');
    },
  },
};
</script>
<style lang="scss" scoped>
div.page-list {
  position: relative;
  height: 100%;

  div.drag {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    resize: both;
    overflow: auto;
    background-color: aquamarine;
  }
}
</style>
