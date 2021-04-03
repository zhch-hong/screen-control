<template>
  <div class="page-list">
    <div class="layout-item">
      <h4>列表栏目</h4>
      <div class="item-list">
        <div v-for="index of 4" :key="index" class="item" draggable="true" @dragend="onItemDragend">
          name_{{ index }}
        </div>
      </div>
      <h4>链接栏目</h4>
      <h4>图表栏目</h4>
    </div>
    <div class="main-container">
      <PortalBase @submit="handleSubmit" />
      <div
        ref="LayoutPanel"
        class="layout-panel"
        @drop="ondrop"
        @dragover="ondragover"
        @dragenter="ondragenter"
        @dragleave="ondragleave"
      >
        <ul v-for="indexul in 100" :key="indexul" class="back" :style="{ margin: `${margin} 0` }">
          <li
            v-for="indexli in 20"
            :key="indexli"
            :ref="'REF_' + indexul + '_' + indexli"
            :style="{ width: border, height: border }"
          ></li>
        </ul>
        <!-- <div class="drag" draggable="true" @dragstart="ondragstart" @dragend="ondragend">
        <div class="horizontal" @mousedown.self.left.prevent.stop="resizeHeight($event)"></div>
        <div class="vertical" @mousedown.self.left.prevent.stop="resizeWidth($event)"></div>
      </div> -->
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import _ from 'lodash';
import DragItem from '../components/DragItem.vue';
import PortalBase from '../components/PortalBase.vue';

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
  name: 'create-portal',

  components: {
    PortalBase,
  },

  data() {
    return {
      consumedWidth: CONSUMED_WIDTH,
      border: '',
      margin: '',
    };
  },

  created() {
    this.fetchMenhuData();
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
    fetchMenhuData() {
      console.log(this.$route.params);
    },

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
        const Class = Vue.extend(DragItem);
        const instance = new Class();
        const name = e.target.innerText;

        instance.getElement = this.getElement;
        instance.border = this.border;
        instance.margin = this.margin;
        instance.consumedWidth = this.consumedWidth;

        const div = document.createElement('div');
        this.$refs.LayoutPanel.append(div);
        instance.$mount(div);

        instance.$nextTick(() => {
          instance.$set(instance.$data, 'dragName', name);
        });
      }
    },

    /**
     * 获取拖动元素
     * @param value ref值
     * @returns HTMLDivElement
     */
    getElement(value) {
      return this.$refs[value][0];
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

    handleSubmit() {
      const element = this.$refs.LayoutPanel;
      const nodeList = element.querySelectorAll('div.drag');
      const dataList = [];
      nodeList.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const data = {
          page_uuid: node.innerText,
          org_level_uuid: '',
          portal_person: '',
          page_left_top_X: rect.left,
          page_left_top_Y: rect.top,
          page_right_botton_X: rect.right,
          page_right_botton_Y: rect.bottom,
        };
        dataList.push(data);
      });

      console.log(dataList);
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

div.main-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  div.layout-panel {
    flex-grow: 1;
    position: relative;
    overflow: auto;

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
}
</style>
