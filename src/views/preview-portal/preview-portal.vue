<template>
  <el-scrollbar style="height: 100vh; background-color: #f2f2f2" wrapStyle="height: 100%; overflow-x: hidden;">
    <div ref="preview" class="preview" :style="{ margin, height, 'background-image': `url(${backgroundImage})` }"></div>
  </el-scrollbar>
</template>
<script>
import Vue from 'vue';
import { menhuData } from '@/network';
import backgroundImage from '@/asseats/Snipaste_2021-05-17_20-52-22.png';
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
      backgroundImage: backgroundImage,
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
        } else {
          this.$message.warning(data.msg);
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
        this.setLanmuData(instance, lm);

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
      const m = 10;

      instance.$set(s, 'top', (page_left_top_Y - 1) * this.borderLength + m + 'px');
      instance.$set(s, 'left', (page_left_top_X - 1) * this.borderLength + m + 'px');
      instance.$set(s, 'width', (page_right_botton_X - page_left_top_X + 1) * this.borderLength - m * 2 + 'px');
      instance.$set(s, 'height', (page_right_botton_Y - page_left_top_Y + 1) * this.borderLength - m * 2 + 'px');
    },

    setLanmuData(
      instance,
      {
        page_name = '获取栏目名称失败',
        page_type = '',
        is_use = '',
        is_refresh_button = '',
        is_show_underline = '',
        is_more_button = '',
        is_add_button = '',
        is_show_title = '',
        new_url = '',
        click_view_more = '',
      }
    ) {
      const l = instance.lanmu;

      instance.$set(l, 'pageName', page_name);
      instance.$set(l, 'pageType', page_type);
      instance.$set(l, 'isUse', is_use);
      instance.$set(l, 'isRefreshButton', is_refresh_button);
      instance.$set(l, 'isShowUnderline', is_show_underline);
      instance.$set(l, 'isMoreButton', is_more_button);
      instance.$set(l, 'isAddButton', is_add_button);
      instance.$set(l, 'isShowTitle', is_show_title);
      instance.$set(l, 'newUrl', new_url);
      instance.$set(l, 'clickViewMore', click_view_more);
    },
  },
};
</script>
<style lang="scss" scoped>
div.preview {
  position: relative;
  min-height: 100vh;
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
