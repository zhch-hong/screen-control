<template>
  <div
    class="drag"
    draggable="true"
    :data-start="startAddress"
    :data-end="endAddress"
    :style="{ borderStyle }"
    @dragstart="ondragstart"
    @dragend="ondragend"
  >
    <i class="el-icon-delete delete" title="删除栏目" @click="$emit('remove')"></i>
    <div class="name">{{ dragName }}</div>
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

/**
 * 拖动前的位置和宽高
 */
const beforeDragAddress = {
  start: '',
  end: '',
  top: '',
  left: '',
  width: '',
  height: '',
};

export default {
  data() {
    return {
      dragName: '',
      dragRect: null,
      startAddress: '',
      endAddress: '',
      borderStyle: 'solid',
    };
  },

  mounted() {
    this.refreshAddress();
    this.setUUID();
  },

  methods: {
    setUUID() {
      this.$el.setAttribute('data-uuid', this.uuid);
      this.$el.setAttribute('data-page_uuid', this.page_uuid);
    },

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

    /**
     * 重置当前栏目到上一次的状态
     * 用于拖动结束时与其他栏目发生交错的情况下还原到之前的状态
     */
    resetToPre() {
      this.$el.setAttribute('data-start', beforeDragAddress.start);
      this.$el.setAttribute('data-end', beforeDragAddress.end);
      this.$el.style.top = beforeDragAddress.top;
      this.$el.style.left = beforeDragAddress.left;
      this.$el.style.width = beforeDragAddress.width;
      this.$el.style.height = beforeDragAddress.height;

      this.$emit('dragend', [this.$el.getAttribute('data-start'), this.$el.getAttribute('data-end')]);
    },

    ondragstart(e) {
      this.borderStyle = 'dashed';

      UNRELATED.offsetX = e.offsetX;
      UNRELATED.offsetY = e.offsetY;

      // 为resetToPre方法做数据铺垫
      // 记录拖动前的位置，如果拖动后出现栏目交错，需要将这些数据还原
      const target = e.target;
      beforeDragAddress.start = target.getAttribute('data-start');
      beforeDragAddress.end = target.getAttribute('data-end');
      beforeDragAddress.top = getComputedStyle(target).getPropertyValue('top');
      beforeDragAddress.left = getComputedStyle(target).getPropertyValue('left');
      beforeDragAddress.width = getComputedStyle(target).getPropertyValue('width');
      beforeDragAddress.height = getComputedStyle(target).getPropertyValue('height');
    },

    /**
     * 已经存在于布局区域的栏目块拖动结束
     */
    async ondragend(e) {
      this.borderStyle = 'solid';

      const top = e.clientY + this.scrollTop.value - UNRELATED.offsetY - this.consumedHeight;
      const left = e.clientX - this.consumedWidth - UNRELATED.offsetX;
      const len = this.border + this.margin;
      const row = top / len;
      const col = left / len;

      const li = this.getElement('REF_' + Math.ceil(row) + '_' + Math.ceil(col));

      if (!li) return;

      const rect = li.getBoundingClientRect();

      e.target.style.left = rect.left - this.consumedWidth + 'px';
      e.target.style.top = rect.top + this.scrollTop.value - this.consumedHeight + 'px';

      this.setAddressData();

      this.overflowXFix();

      await this.$nextTick();
      setTimeout(() => {
        console.log([this.$el.getAttribute('data-start'), this.$el.getAttribute('data-end')]);
        this.$emit('dragend', [this.$el.getAttribute('data-start'), this.$el.getAttribute('data-end')]);
      }, 1000);
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
      const x = Math.round((left + width) / (this.border + this.margin));

      const top = _f(getComputedStyle(this.$el).getPropertyValue('top'));
      const height = _f(getComputedStyle(this.$el).getPropertyValue('height'));
      const y = Math.round((top + height) / (this.border + this.margin));

      this.endAddress = `${x}-${y}`;
    },

    /**
     * 判断元素是否超出右边界
     * 如果宽度超出了右边界，则将缩减宽度至最右边，20
     */
    overflowXFix() {
      let lx = this.$el.getAttribute('data-start').split('-')[0];
      let rx = this.$el.getAttribute('data-end').split('-')[0];

      if (rx > 20) {
        const rby = this.$el.getAttribute('data-end').split('-')[1];
        const w = (20 - lx + 1) * this.border + (20 - lx) * this.margin;
        this.$el.style.width = w + 'px';
        this.endAddress = `${20}-${rby}`;
      }
    },

    resizeWidth(e) {
      this.borderStyle = 'dashed';

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
          this.borderStyle = 'solid';
          dragElement.style.width = Math.ceil((e.clientX - this.consumedWidth) / width) * width - left + 'px';
          document.removeEventListener('mousemove', handler);
          this.setEndAddress();
          this.$nextTick(() => {
            this.$emit('dragend', [this.$el.getAttribute('data-start'), this.$el.getAttribute('data-end')]);
          });
        },
        { once: true }
      );
    },

    resizeHeight(e) {
      this.borderStyle = 'dashed';

      const dragElement = e.target.parentElement;
      const top = parseFloat(dragElement.style.top);
      const handler = (e) => {
        dragElement.style.height = e.clientY + this.scrollTop.value - top - this.consumedHeight + 'px';
      };

      document.addEventListener('mousemove', handler);

      document.addEventListener(
        'mouseup',
        (e) => {
          this.borderStyle = 'solid';

          const _f = Number.parseFloat;
          const _h = this.border + this.margin;
          const _d =
            Math.ceil((e.clientY - this.consumedHeight + this.scrollTop.value) / _h) * _h -
            (top + _f(dragElement.style.height));
          dragElement.style.height = _f(dragElement.style.height) + _d + 'px';
          dragElement.style.lineHeight = _f(dragElement.style.height) + _d + 'px';

          document.removeEventListener('mousemove', handler);

          this.setEndAddress();
          this.$nextTick(() => {
            this.$emit('dragend', [this.$el.getAttribute('data-start'), this.$el.getAttribute('data-end')]);
          });
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
  cursor: move;
  top: 0;
  left: 0;
  width: 86px;
  height: 86px;
  text-align: center;
  color: #0066ff;
  font-size: 20px;
  font-weight: 600;
  opacity: 0.3;
  background-color: #66a3ff;
  box-sizing: border-box;
  border: 2px #000a1a;

  i.delete {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    &:hover {
      color: #001433;
    }
  }

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

  div.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
