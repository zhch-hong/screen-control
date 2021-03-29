<template>
  <div class="page-list">
    <div class="layout-item">
      <h4>列表栏目</h4>
      <div class="item-list">
        <div v-for="index of 4" :key="index" class="item" draggable="true" @dragend="onItemDragend"></div>
      </div>
      <h4>链接栏目</h4>
      <h4>图表栏目</h4>
    </div>
    <div
      ref="LayoutPanel"
      class="layout-panel"
      @drop="ondrop"
      @dragover="ondragover"
      @dragenter="ondragenter"
      @dragleave="ondragleave"
    >
      <div style="padding: 1px">
        <ul v-for="indexul in 100" :key="indexul" class="back" :style="{ margin: `${margin} 0` }">
          <li
            v-for="indexli in 20"
            :key="indexli"
            :ref="'REF_' + indexul + '_' + indexli"
            :style="{ width: border, height: border }"
          ></li>
        </ul>
      </div>
      <!-- <div class="drag" draggable="true" @dragstart="ondragstart" @dragend="ondragend">
        <div class="horizontal" @mousedown.self.left.prevent.stop="resizeHeight($event)"></div>
        <div class="vertical" @mousedown.self.left.prevent.stop="resizeWidth($event)"></div>
      </div> -->
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import _ from 'lodash';
import DragItem from './components/DragItem.vue';

const CONSUMED_WIDTH = 360;

function getComponentOption(h, dragstartHandler, dragendHandler, resizeHeight, resizeWidth) {
  const drag = {
    render() {
      return h(
        'div',
        {
          staticClass: 'drag',
          attrs: {
            draggable: true,
          },
          on: {
            dragstart: dragstartHandler,
            dragend: dragendHandler,
          },
        },
        [
          h('div', {
            staticClass: 'horizontal',
            on: {
              mousedown: resizeHeight,
            },
          }),
          h('div', {
            staticClass: 'vertical',
            on: {
              mousedown: resizeWidth,
            },
          }),
        ]
      );
    },
  };

  return drag;
}

export default {
  data() {
    return {
      consumedWidth: CONSUMED_WIDTH,
      border: '',
      margin: '',
    };
  },

  mounted() {
    this.debounceFlush = _.debounce(this.flushLayout, 300);
    window.addEventListener('resize', this.debounceFlush);
    this.flushLayout();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.debounceFlush);
  },

  methods: {
    flushLayout() {
      const width = window.innerWidth - CONSUMED_WIDTH;
      const border = Math.floor((width * 3.75) / 86);
      this.border = border + 'px';
      this.margin = Math.floor(border / 3.75 / 2) + 'px';
    },

    /**
     * 当左边单个栏目拖动结束时的处理回调
     */
    onItemDragend(e) {
      if (e.dataTransfer.dropEffect === 'copy') {
        // const option = getComponentOption(
        //   this.$createElement,
        //   this.ondragstart,
        //   this.ondragend,
        //   this.resizeHeight,
        //   this.resizeWidth
        // );
        // const optionClass = Vue.extend(option);
        // console.log(this.$refs.LayoutPanel);
        // const div = document.createElement('div');
        // this.$refs.LayoutPanel.append(div);
        // const instance = new optionClass();
        // instance.$mount(div);

        const Class = Vue.extend(DragItem);
        const instance = new Class();
        const div = document.createElement('div');
        this.$refs.LayoutPanel.append(div);
        instance.$mount(div);
      }
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
  height: 100%;
  display: flex;
}

div.layout-item {
  width: 180px;
  background-color: #f9f9f9;

  h4 {
    margin: 0.6em 5px;
  }

  div.item-list {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    div.item {
      margin: 4px 0;
      width: 80px;
      height: 80px;
      background-color: aqua;
    }
  }
}

div.layout-panel {
  position: relative;
  overflow: auto;
  flex-grow: 1;

  ul.back {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
    justify-content: space-evenly;

    li {
      background-color: #f2f2f2;
    }
  }
}
</style>
