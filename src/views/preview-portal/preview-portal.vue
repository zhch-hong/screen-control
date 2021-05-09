<template>
  <el-scrollbar style="height: 100vh; background-color: #f2f2f2" wrapStyle="height: 100%; overflow-x: hidden;">
    <div ref="preview" class="preview" :style="{ margin, height }"></div>
  </el-scrollbar>
</template>
<script>
import Vue from 'vue';
import { menhuData } from '@/network';
import RenderWrap from './RenderWrap.vue';
import LanmuItem from './LanmuItem.vue';

function getBorderLength() {
  return Math.floor(document.documentElement.clientWidth / 20);
}

function getMargin() {
  const f = (document.documentElement.clientWidth % 20) / 2;
  const i = Math.floor(f);
  return i + 'px';
}

export default {
  name: 'preview-portal',

  data() {
    return {
      uuid: '',
      margin: getMargin(),
      height: '',
      borderLength: getBorderLength(),
      lanmuList: [],
    };
  },

  mounted() {
    const { uuid } = this.$route.params;
    this.uuid = uuid;
    this.fetchMenhuData();
  },

  methods: {
    fetchMenhuData() {
      const { uuid } = this.$route.params;
      menhuData({ '~table~': 'lx_sys_portals', uuid }).then(({ data }) => {
        if (data.code == 200) {
          console.log('门户数据', data);

          this.lanmuList = data.lx_sys_portals_sub;
          this.refreshLayout();
        }
      });
    },

    refreshLayout() {
      this.height = Math.max(...this.lanmuList.map((item) => item.page_right_botton_Y)) * this.borderLength + 'px';

      const preview = this.$refs.preview;

      this.lanmuList.forEach((lm, index) => {
        const div = document.createElement('div');
        preview.append(div);

        const subclass = Vue.extend(LanmuItem);
        const instance = new subclass();
        instance.$mount(div);
        this.setAddress(instance, lm);

        const mountElement = instance.getMountElement();
        const renderWrapClass = Vue.extend(RenderWrap);
        const renderWrapInstance = new renderWrapClass();
        if (index % 2 === 0) renderWrapInstance.path = '/OneCom';
        else renderWrapInstance.path = '/TwoCom';
        renderWrapInstance.$mount(mountElement);
      });
    },

    setAddress(instance, { page_left_top_X, page_left_top_Y, page_right_botton_X, page_right_botton_Y }) {
      const s = instance.containerObservableStyle;

      instance.$set(s, 'top', (page_left_top_Y - 1) * this.borderLength + 'px');
      instance.$set(s, 'left', (page_left_top_X - 1) * this.borderLength + 'px');
      instance.$set(s, 'width', (page_right_botton_X - page_left_top_X + 1) * this.borderLength + 'px');
      instance.$set(s, 'height', (page_right_botton_Y - page_left_top_Y + 1) * this.borderLength + 'px');
      instance.$set(s, 'borderWidth', parseFloat(this.margin) + 4 + 'px');
    },
  },
};
</script>
<style lang="scss" scoped>
div.preview {
  position: relative;
  min-height: 100vh;
}
</style>
