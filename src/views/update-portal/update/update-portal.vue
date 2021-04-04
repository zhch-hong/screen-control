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
      <PortalBase :data="portalBase" @submit="handleSubmit" />
      <div
        ref="LayoutPanel"
        class="layout-panel"
        @drop="ondrop"
        @dragover="ondragover"
        @scroll.self.prevent.stop="(e) => (scrollTop.value = e.target.scrollTop)"
      >
        <ul v-for="indexul in 100" :key="indexul" class="back" :style="{ margin: `${margin}px 0` }">
          <li
            v-for="indexli in 20"
            :key="indexli"
            :ref="'REF_' + indexul + '_' + indexli"
            :style="{ width: border + 'px', height: border + 'px' }"
          ></li>
        </ul>
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
import { menhuData, updateMenhu } from '@/network';

const CONSUMED_WIDTH = 360;
const CONSUMED_HEIGHT = 147;

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
  name: 'update-portal',

  components: {
    PortalBase,
  },

  data() {
    return {
      border: 0,
      margin: 0,
      portalBase: null,
      scrollTop: {
        value: 0,
      },
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
      /* const { uuid } = this.$route.params;
      menhuData({ '~table~': 'lx_sys_portals', uuid })
        .then(({ data }) => {
          if (data.code == 200) {
            console.log(data.data);
          }
        })
        .catch((error) => {
          console.warn(error.message);
        }); */
      const data = {
        msg: '成功',
        code: '200',
        data: {
          id: 9,
          uuid: '6781cfce-e517-44c3-bee0-5163760e7624',
          portal_name: '测试门户名称2X',
          portal_menu: '04bea7e1-235b-494f-ac94-bbeef23f03d5',
          is_use: '',
          background_img: 'https://interactive-examples.mdn.mozilla.net/media/examples/lizard.png',
          created_by: 1,
          created_utc_datetime: 1616051161000,
          updated_by: 1,
          updated_utc_datetime: 1616053686000,
        },
        '~table~': 'lx_sys_portals',
        lx_sys_portals_sub: [
          {
            portal_person: '',
            org_level_uuid: '00000000-0000-0000-0000-000000000000',
            page_uuid: 'ggggggg',
            page_left_top_Y: 1,
            page_right_botton_X: 3,
            id: 1,
            page_left_top_X: 1,
            page_right_botton_Y: 4,
            uuid: '315e127a-e112-4a94-97d9-fee0aeb1a1f3',
            portal_uuid: '6781cfce-e517-44c3-bee0-5163760e7624',
          },
          {
            portal_person: '',
            org_level_uuid: '00000000-0000-0000-0000-000000000000',
            page_uuid: 'xxxx',
            page_left_top_Y: 4,
            page_right_botton_X: 15,
            id: 1,
            page_left_top_X: 6,
            page_right_botton_Y: 15,
            uuid: '315e127a-e112-4a94-97d9-fee0aeb1a1f3',
            portal_uuid: '6781cfce-e517-44c3-bee0-5163760e7624',
          },
        ],
        status: 'success',
      };

      this.$nextTick(() => {
        this.portalBase = data.data;
        this.refreshDrag(data.lx_sys_portals_sub);
      });
    },

    flushLayout() {
      const width = window.innerWidth - CONSUMED_WIDTH;
      const border = Math.floor((width * 3.75) / 86);

      this.border = border;
      this.margin = Math.floor(border / 3.75 / 2);
    },

    ondrop(e) {
      e.preventDefault();
    },

    ondragover(e) {
      e.preventDefault();
    },

    /**
     * 当左边单个栏目拖动结束时的处理回调
     */
    onItemDragend(e) {
      if (e.dataTransfer.dropEffect === 'copy') {
        // 计算处拖动到哪一个方块放置的
        const scrollY = this.$refs.LayoutPanel.scrollTop;
        const top = Math.ceil((e.clientY - CONSUMED_HEIGHT + scrollY) / (this.border + this.margin));
        const left = Math.ceil((e.clientX - CONSUMED_WIDTH) / (this.border + this.margin));

        // 创建挂载元素
        const mountEl = document.createElement('div');
        this.$refs.LayoutPanel.append(mountEl);

        // 创建实例，并赋值一些必须的数据，然后挂载到DOM
        const Class = Vue.extend(DragItem);
        const instance = new Class();
        instance.getElement = this.getElement;
        instance.border = this.border;
        instance.margin = this.margin;
        instance.consumedWidth = CONSUMED_WIDTH;
        instance.consumedHeight = CONSUMED_HEIGHT;
        instance.scrollTop = this.scrollTop;
        instance.$set(instance.$data, 'dragName', e.target.innerText);
        instance.$set(instance.$data, 'dragRect', {
          top,
          right: left,
          bottom: top,
          left,
        });
        instance.$mount(mountEl);
      }
    },

    /**
     * 获取布局区域某一个li元素
     * @param value ref值
     * @returns HTMLLiElement
     */
    getElement(value) {
      return this.$refs[value][0];
    },

    handleSubmit(portalBase) {
      console.log('基础数据', portalBase);
      const dataList = [];
      const _f = Number.parseFloat;

      const element = this.$refs.LayoutPanel;
      const nodeList = element.querySelectorAll('div.drag');
      nodeList.forEach((element) => {
        const start = element.getAttribute('data-start').split('-');
        const end = element.getAttribute('data-end').split('-');
        const data = {
          uuid: '',
          portals_uuid: '',
          page_uuid: element.innerText,
          org_level_uuid: '',
          portal_person: '',
          page_left_top_X: _f(start[0]),
          page_left_top_Y: _f(start[1]),
          page_right_botton_X: _f(end[0]),
          page_right_botton_Y: _f(end[1]),
        };
        dataList.push(data);
      });

      const data = {
        '~table~': 'lx_sys_portals',
        uuid: this.portalBase.uuid,
        portal_name: portalBase.portal_name,
        portal_menu: portalBase.portal_menu,
        background_img: portalBase.background_img,
        is_use: this.portalBase.is_use,
        lx_sys_portals_sub: dataList,
      };

      updateMenhu(data)
        .then(({ data }) => {
          if (data.code == 200) {
            this.$message.success(data.msg);
          }
        })
        .catch(({ message }) => {
          console.warn(message);
        });
    },

    /**
     * 将门户中已有的栏目添加到布局区域
     * @param dragList 栏目列表
     */
    refreshDrag(dragList) {
      dragList.forEach((item) => {
        const mountEl = document.createElement('div');
        this.$refs.LayoutPanel.append(mountEl);

        const Class = Vue.extend(DragItem);
        const instance = new Class();
        instance.getElement = this.getElement;
        instance.border = this.border;
        instance.margin = this.margin;
        instance.consumedWidth = CONSUMED_WIDTH;
        instance.consumedHeight = CONSUMED_HEIGHT;
        instance.scrollTop = this.scrollTop;
        instance.$set(instance.$data, 'dragName', item.page_uuid);
        instance.$set(instance.$data, 'dragRect', {
          top: item.page_left_top_Y,
          right: item.page_right_botton_X,
          bottom: item.page_right_botton_Y,
          left: item.page_left_top_X,
        });
        instance.$mount(mountEl);
      });
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
