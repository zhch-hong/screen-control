<template>
  <div
    class="drag"
    draggable="true"
    :data-start="startAddress"
    :data-end="endAddress"
    @dragstart="ondragstart"
    @dragend="ondragend"
  >
    <span>{{ dragName }}</span>
    <div class="horizontal" @mousedown.self.left.prevent.stop="resizeHeight($event)"></div>
    <div class="vertical" @mousedown.self.left.prevent.stop="resizeWidth($event)"></div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

const UNRELATED = {
  offsetX: 0,
  offsetY: 0,
};

export default {
  data() {
    return {
      dragName: '',
      dragRect: null,
      startAddress: '',
      endAddress: '',
    };
  },

  mounted() {
    this.refreshAddress();
  },

  methods: {
    refreshAddress() {
      if (this.dragRect) {
        const top = this.dragRect.top,
          left = this.dragRect.left;
        const li = this.getElement('REF_' + top + '_' + left);
        const layout = li.parentElement.parentElement;
        const liRect = li.getBoundingClientRect();
        const layoutRect = layout.getBoundingClientRect();
        const styleTop = liRect.top - layoutRect.top;
        const styleLeft = liRect.left - layoutRect.left;
        this.$el.style.top = styleTop + this.scrollTop.value + 'px';
        this.$el.style.left = styleLeft + 'px';

        this.refreshSize(styleTop, styleLeft, this.dragRect.bottom, this.dragRect.right);
      }
    },

    refreshSize(top, left, bottom, right) {
      const li = this.getElement('REF_' + bottom + '_' + right);
      const layout = li.parentElement.parentElement;
      const liRect = li.getBoundingClientRect();
      const layoutRect = layout.getBoundingClientRect();
      const styleHeight = liRect.bottom - layoutRect.top - top;
      const styleWidth = liRect.right - layoutRect.left - left;

      this.$el.style.width = styleWidth + 'px';
      this.$el.style.height = styleHeight + 'px';
      this.$el.style.lineHeight = styleHeight + 'px';

      this.setAddressData();
    },

    ondragstart(e) {
      UNRELATED.offsetX = e.offsetX;
      UNRELATED.offsetY = e.offsetY;
    },

    /**
     * 已经存在于布局区域的栏目块拖动结束
     */
    ondragend(e) {
      const top = e.clientY + this.scrollTop.value - UNRELATED.offsetY - this.consumedHeight;
      const left = e.clientX - this.consumedWidth - UNRELATED.offsetX;
      const len = this.border + this.margin;
      const row = top / len;
      const col = left / len;

      const li = this.getElement('REF_' + Math.ceil(row) + '_' + Math.ceil(col));
      const rect = li.getBoundingClientRect();

      e.target.style.left = rect.left - this.consumedWidth + 'px';
      e.target.style.top = rect.top + this.scrollTop.value - this.consumedHeight + 'px';

      this.$el.setAttribute('data-start', li.getAttribute('data-address'));

      this.setAddressData();
    },

    setAddressData() {
      this.setStartAddress();
      this.setEndAddress();
    },

    setStartAddress() {
      const _f = Number.parseFloat;

      const left = _f(getComputedStyle(this.$el).getPropertyValue('left'));
      const x = Math.ceil(left / (this.border + this.margin));

      const top = _f(getComputedStyle(this.$el).getPropertyValue('top'));
      const y = Math.ceil(top / (this.border + this.margin));

      this.startAddress = `${x}-${y}`;
    },

    setEndAddress() {
      const _f = Number.parseFloat;

      const left = _f(getComputedStyle(this.$el).getPropertyValue('left'));
      const width = _f(getComputedStyle(this.$el).getPropertyValue('width'));
      const x = Math.floor((left + width) / (this.border + this.margin));

      const top = _f(getComputedStyle(this.$el).getPropertyValue('top'));
      const height = _f(getComputedStyle(this.$el).getPropertyValue('height'));
      const y = Math.floor((top + height) / (this.border + this.margin));

      this.endAddress = `${x}-${y}`;
    },

    resizeWidth(e) {
      const dragElement = e.target.parentElement;
      const left = parseFloat(dragElement.style.left);
      const ul = dragElement.parentElement.querySelector('ul.back');
      const space = (ul.clientWidth - ul.childElementCount * this.border) / (ul.childElementCount + 1);
      const width = space + this.border;

      const handler = (e) => {
        dragElement.style.width = e.clientX - left - this.consumedWidth + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          dragElement.style.width = Math.ceil((e.clientX - this.consumedWidth) / width) * width - left + 'px';
          document.removeEventListener('mousemove', handler);
          this.setEndAddress();
        },
        { once: true }
      );
    },

    resizeHeight(e) {
      const dragElement = e.target.parentElement;
      const top = parseFloat(dragElement.style.top);
      const handler = (e) => {
        dragElement.style.height = e.clientY + this.scrollTop.value - top - this.consumedHeight + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          const _f = Number.parseFloat;
          const _h = this.border + this.margin;
          const _d =
            Math.ceil((e.clientY - this.consumedHeight + this.scrollTop.value) / _h) * _h -
            (top + _f(dragElement.style.height));
          dragElement.style.height = _f(dragElement.style.height) + _d + 'px';
          dragElement.style.lineHeight = _f(dragElement.style.height) + _d + 'px';

          document.removeEventListener('mousemove', handler);

          this.setEndAddress();
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
  text-align: center;
  color: #0066ff;
  font-size: 20px;
  font-weight: 600;
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
