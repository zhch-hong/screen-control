<template>
  <div class="portal-base">
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="formData.portal_name" style="width: 215px"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.portal_type">
          <el-option label="门户" value="menhu"></el-option>
          <el-option label="大屏" value="daping"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联菜单" style="margin-bottom: 0">
        <el-select v-model="formData.portal_menu">
          <el-option v-for="item of menuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus"></i>
    </el-upload>
    <div>
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button @click="handleSubmit">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        portal_name: '',
        portal_type: '',
        portal_menu: '',
      },
      /** 背景图url */
      imageUrl: '',
      /** 关联菜单下拉框数据 */
      menuList: [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ],
    };
  },

  methods: {
    handleSubmit() {
      this.$emit('submit');
    },
  },
};
</script>
<style lang="scss" scoped>
.portal-base {
  display: flex;
  height: 180px;
  margin-top: 10px;
  align-items: center;
}

div.avatar-uploader {
  width: 135px;
  height: 135px;
  border: 1px dashed #d9d9d9;
  margin: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

img.avatar {
  max-width: 150px;
  max-height: 150px;
}
</style>
