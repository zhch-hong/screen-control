<template>
  <div>门户预览{{ uuid }}</div>
</template>
<script>
export default {
  name: 'preview-portal',

  data() {
    return {
      uuid: '',
    };
  },

  mounted() {
    const { uuid } = this.$route.params;
    this.uuid = uuid;
  },
};
</script>
