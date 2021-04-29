<template>
  <component :is="comp" />
</template>
<script>
export default {
  data() {
    return {
      comp: '',
      path: '',
    };
  },

  created() {
    this.comp = (resolve) => require(['@/components/' + this.path], resolve);
  },
};
</script>
