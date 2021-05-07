<template>
  <el-scrollbar style="height: 100vh" wrapStyle="height: 100%; overflow-x: hidden;">
    <div ref="preview" class="preview" :style="{ margin, height }"></div>
  </el-scrollbar>
</template>
<script>
import Vue from 'vue';
import { lanmuData, menhuData } from '@/network';
import RenderWrap from './RenderWrap.vue';

const LM_LIST = [
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: '9663dbb7-b87c-49cf-82ea-f664203d7af8',
    page_left_top_Y: 1,
    page_right_botton_X: 11,
    id: 46,
    page_left_top_X: 3,
    page_right_botton_Y: 3,
    uuid: 'f2daa421-da60-455d-b921-d2ec7f572bff',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: 'f2daa421-da60-455d-b921-d2ec7f572bff',
    page_left_top_Y: 1,
    page_right_botton_X: 20,
    id: 47,
    page_left_top_X: 12,
    page_right_botton_Y: 6,
    uuid: '745dfbe6-24e6-4701-91ae-292ca60ae37b',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: '9663dbb7-b87c-49cf-82ea-f664203d7af8',
    page_left_top_Y: 1,
    page_right_botton_X: 2,
    id: 48,
    page_left_top_X: 1,
    page_right_botton_Y: 4,
    uuid: '892ad77b-62b3-4bbc-812e-dc30b63caa62',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: '9663dbb7-b87c-49cf-82ea-f664203d7af8',
    page_left_top_Y: 4,
    page_right_botton_X: 9,
    id: 52,
    page_left_top_X: 3,
    page_right_botton_Y: 6,
    uuid: 'b23eac21-d36a-4494-8a73-776aa869d428',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: '82314f3e-006f-4caa-b2a9-d72057563ca1',
    page_left_top_Y: 5,
    page_right_botton_X: 2,
    id: 53,
    page_left_top_X: 1,
    page_right_botton_Y: 6,
    uuid: '96a34eef-1916-4a61-961e-d7a950fc6c43',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
  {
    portal_person: '',
    org_level_uuid: '',
    page_uuid: '82314f3e-006f-4caa-b2a9-d72057563ca1',
    page_left_top_Y: 4,
    page_right_botton_X: 11,
    id: 54,
    page_left_top_X: 10,
    page_right_botton_Y: 6,
    uuid: 'e7057971-2596-48d4-aa59-3757fd14377d',
    portal_uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
  },
];

function getBorderLength() {
  return Math.floor(document.documentElement.clientWidth / 20);
}

function getMargin() {
  const f = (document.documentElement.clientWidth % 20) / 2;
  const i = Math.floor(f);
  return i + 'px';
}

function color() {
  return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(
    Math.random() * 255
  )})`;
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
      pathLink: '',
    };
  },

  watch: {
    pathLink(value) {
      console.log(value);
    },
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
          const promises = [];
          data.lx_sys_portals_sub.forEach((lm) => {
            promises.push(lanmuData({ uuid: lm.uuid, '~table~': 'lx_sys_pages' }));
          });

          Promise.all(promises).then((array) => {
            console.log('门户栏目', array);

            // this.lanmuList = array.map((item) => item.data);
            this.lanmuList = LM_LIST;

            this.refreshLayout();
          });
        }
      });
    },

    refreshLayout() {
      const preview = this.$refs.preview;
      this.height = Math.max(...this.lanmuList.map((item) => item.page_right_botton_Y)) * this.borderLength + 'px';

      this.lanmuList.forEach((LM, index) => {
        const div = document.createElement('div');
        const divIn = document.createElement('div');
        const mountEl = document.createElement('div');
        div.append(divIn);
        divIn.append(mountEl);
        preview.append(div);
        this.setContainer(divIn);
        this.setAddress(div, LM);

        const cls = Vue.extend(RenderWrap);
        const instance = new cls();
        if (index % 2 === 0) instance.path = '/OneCom';
        else instance.path = '/TwoCom';
        instance.$mount(mountEl);
      });
    },

    setAddress(dom, { page_left_top_X, page_left_top_Y, page_right_botton_X, page_right_botton_Y }) {
      dom.style['box-sizing'] = 'border-box';
      dom.style['position'] = 'absolute';
      dom.style['top'] = (page_left_top_Y - 1) * this.borderLength + 'px';
      dom.style['left'] = (page_left_top_X - 1) * this.borderLength + 'px';
      dom.style['width'] = (page_right_botton_X - page_left_top_X + 1) * this.borderLength + 'px';
      dom.style['height'] = (page_right_botton_Y - page_left_top_Y + 1) * this.borderLength + 'px';
      dom.style['border'] = `${this.margin} solid transparent`;
    },

    setContainer(dom) {
      dom.style['background-color'] = color();
      dom.style['height'] = '100%';
      dom.style['overflow'] = 'hidden';
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
