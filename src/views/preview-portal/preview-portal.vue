<template>
  <div>门户预览{{ uuid }}{{ length }}</div>
</template>
<script>
import { menhuData } from '@/network';

function getBorderLength() {
  return Math.floor(window.innerWidth / 20);
}

export default {
  name: 'preview-portal',

  data() {
    return {
      uuid: '',
      borderLength: getBorderLength(),
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
      menhuData({ '~table~': 'lx_sys_portals', uuid })
        .then(({ data }) => {
          if (data.code == 200) {
            console.log(data.data);
          }
        })
        .catch((error) => {
          console.warn(error.message);
        });
    },

    setDom(dom, { page_left_top_X, page_left_top_Y, page_right_botton_X, page_right_botton_Y }) {
      dom.style.top = (page_left_top_Y - 1) * this.borderLength + 'px';
      dom.style.left = (page_left_top_X - 1) * this.borderLength + 'px';
      dom.style.width = (page_right_botton_X - page_left_top_X + 1) * this.borderLength + 'px';
      dom.style.top = (page_right_botton_Y - page_left_top_Y + 1) * this.borderLength + 'px';
    },
  },
};
</script>
