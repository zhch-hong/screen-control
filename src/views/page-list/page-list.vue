<template>
  <div class="page-list" @drop="ondrop" @dragover="ondragover">
    <span style="position: relative" draggable="true" @dragstart="ondragstart" @dragend="ondragend">page-list</span>
  </div>
</template>
<script>
export default {
  methods: {
    ondragstart(e) {
      console.log(e);
    },

    ondragend(e) {
      console.log('offset', e.offsetX, e.offsetY);
      console.log('client', e.clientX, e.clientY);
      e.target.style.top = e.offsetY + 'px';
      e.target.style.left = e.offsetX + 'px';
    },

    ondragover(e) {
      e.preventDefault();
      // console.log(e);
    },

    ondrop(e) {
      e.preventDefault();
      console.log(e);
    },
  },
};
</script>
<style lang="scss" scoped>
div.page-list {
  height: 100%;
}
</style>
