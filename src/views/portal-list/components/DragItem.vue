<template>
  <div class="drag" draggable="true" @dragstart="ondragstart" @dragend="ondragend">
    <span>{{ dragName }}</span>
    <div class="horizontal" @mousedown.self.left.prevent.stop="resizeHeight($event)"></div>
    <div class="vertical" @mousedown.self.left.prevent.stop="resizeWidth($event)"></div>
  </div>
</template>
<script>
const UNRELATED = {
  offsetX: 0,
  offsetY: 0,
  scrollY: 0,
};

const CONSUMED_WIDTH = 360;
const CONSUMED_HEIGHT = 147;

export default {
  data() {
    return {
      dragName: '',
    };
  },

  methods: {
    ondragstart(e) {
      UNRELATED.offsetX = e.offsetX;
      UNRELATED.offsetY = e.offsetY;
      const main = e.target.parentElement;
      UNRELATED.scrollY = main.scrollTop;
    },

    ondragend(e) {
      console.log(CONSUMED_HEIGHT);
      const top = e.clientY + UNRELATED.scrollY - UNRELATED.offsetY - CONSUMED_HEIGHT;
      const left = e.clientX - CONSUMED_WIDTH - UNRELATED.offsetX;

      const len = parseFloat(this.border) + parseFloat(this.margin);
      const row = top / len;
      const col = left / len;

      // const li = this.$refs['REF_' + Math.ceil(row) + '_' + Math.ceil(col)][0];
      const li = this.getElement('REF_' + Math.ceil(row) + '_' + Math.ceil(col));
      const rect = li.getBoundingClientRect();

      e.target.style.left = rect.left - CONSUMED_WIDTH + 'px';
      e.target.style.top = rect.top + UNRELATED.scrollY - CONSUMED_HEIGHT + 'px';
    },

    resizeWidth(e) {
      const dragElement = e.target.parentElement;
      const left = parseFloat(dragElement.style.left);
      const ul = dragElement.parentElement.querySelector('ul.back');
      const space =
        (ul.clientWidth - ul.childElementCount * Number.parseFloat(this.border)) / (ul.childElementCount + 1);
      const width = space + Number.parseFloat(this.border);

      const handler = (e) => {
        dragElement.style.width = e.clientX - left - CONSUMED_WIDTH + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          dragElement.style.width = Math.ceil((e.clientX - CONSUMED_WIDTH) / width) * width - left + 'px';
          document.removeEventListener('mousemove', handler);
        },
        { once: true }
      );
    },

    resizeHeight(e) {
      const dragElement = e.target.parentElement;
      const scrollTop = dragElement.parentElement.scrollTop;
      const top = parseFloat(dragElement.style.top);
      const handler = (e) => {
        dragElement.style.height = e.clientY + scrollTop - top - CONSUMED_HEIGHT + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          const _f = Number.parseFloat;
          const _h = _f(this.border) + _f(this.margin);
          const _d =
            Math.ceil((e.clientY - CONSUMED_HEIGHT + scrollTop) / _h) * _h - (top + _f(dragElement.style.height));
          dragElement.style.height = _f(dragElement.style.height) + _d + 'px';

          document.removeEventListener('mousemove', handler);
        },
        { once: true }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
