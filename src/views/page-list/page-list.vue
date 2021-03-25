<template>
  <div class="page-list" @drop="ondrop" @dragover="ondragover" @dragenter="ondragenter" @dragleave="ondragleave">
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
    <div ref="DRAGGABLE" class="drag" draggable="true" @drag="ondrag" @dragstart="ondragstart" @dragend="ondragend">
      <div class="horizontal" @mousedown.self.left.prevent.stop="resizeHeight($event)"></div>
      <div class="vertical" @mousedown.self.left.prevent.stop="resizeWidth($event)"></div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

import _ from 'lodash';

const UNRELATED = {
  offsetX: 0,
  offsetY: 0,
  scrollY: 0,
};

export default {
  data() {
    return {
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
    console.log('beforeDestroy');
    window.removeEventListener('resize', this.debounceFlush);
  },

  methods: {
    flushLayout() {
      const width = window.innerWidth - 180;
      const border = Math.floor((width * 3.75) / 86);
      this.border = border + 'px';
      this.margin = Math.floor(border / 3.75 / 2) + 'px';
    },

    // ------------------------ 拖拽元素

    /**
     * 开始
     */
    ondragstart(e) {
      UNRELATED.offsetX = e.offsetX;
      UNRELATED.offsetY = e.offsetY;
      const main = e.target.parentElement.parentElement;
      UNRELATED.scrollY = main.scrollTop;
    },

    /**
     * 移动
     */
    ondrag(e) {},

    /**
     * 结束
     */
    ondragend(e) {
      const top = e.clientY + UNRELATED.scrollY - UNRELATED.offsetY;
      const left = e.clientX - 180 - UNRELATED.offsetX;

      const len = parseFloat(this.border) + parseFloat(this.margin);
      const row = top / len;
      const col = left / len;

      const li = this.$refs['REF_' + Math.ceil(row) + '_' + Math.ceil(col)][0];
      const rect = li.getBoundingClientRect();

      e.target.style.left = rect.left - 180 + 'px';
      e.target.style.top = rect.top + UNRELATED.scrollY + 'px';
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

    // ---------------------------------------- 调整宽高
    resizeWidth(e) {
      const dragElement = e.target.parentElement;
      const left = parseFloat(dragElement.style.left);
      const ul = dragElement.parentElement.querySelector('ul.back');
      const space =
        (ul.clientWidth - ul.childElementCount * Number.parseFloat(this.border)) / (ul.childElementCount + 1);
      const width = space + Number.parseFloat(this.border);

      const handler = (e) => {
        dragElement.style.width = e.clientX - left - 180 + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          dragElement.style.width = Math.ceil((e.clientX - 180) / width) * width - left + 1 + 'px';
          document.removeEventListener('mousemove', handler);
        },
        { once: true }
      );
    },

    resizeHeight(e) {
      const dragElement = e.target.parentElement;
      const scrollTop = dragElement.parentElement.parentElement.scrollTop;
      const top = parseFloat(dragElement.style.top);

      const handler = (e) => {
        dragElement.style.height = e.clientY + scrollTop - top + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          const _f = Number.parseFloat;
          const _h = _f(this.border) + _f(this.margin);
          const _d = Math.ceil((e.clientY + scrollTop) / _h) * _h - (top + _f(dragElement.style.height));
          dragElement.style.height = _f(dragElement.style.height) + _d + 1 + 'px';

          document.removeEventListener('mousemove', handler);
        },
        { once: true }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
div.page-list {
  position: relative;

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

  div.drag {
    position: absolute;
    top: 0;
    left: 0;
    width: 86px;
    height: 86px;
    opacity: 0.3;
    background-color: aquamarine;

    div.vertical,
    div.horizontal {
      position: absolute;
      z-index: 2;
    }
    div.vertical {
      right: 0;
      top: 0;
      height: 100%;
      width: 10px;
      cursor: ew-resize;
    }
    div.horizontal {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 10px;
      cursor: ns-resize;
    }
  }
}
</style>
