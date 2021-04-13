<template>
  <div class="portal-base">
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="formData.portal_name" style="width: 215px"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.portal_type">
          <el-option v-for="item of portalType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联菜单" style="margin-bottom: 0">
        <el-select v-model="formData.portal_menu">
          <el-option v-for="item of portalMenu" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
import _ from 'lodash';
import { normalFields, hightFields } from '@/network';

export default {
  props: ['data'],

  data() {
    return {
      formData: {
        portal_name: '',
        portal_type: '',
        portal_menu: '',
      },
      /** 背景图url */
      imageUrl: '',
      /** 类型下拉框数据 */
      portalType: [],
      /** 关联菜单下拉框数据 */
      portalMenu: [],
    };
  },

  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(object) {
        if (object) {
          this.formData.portal_name = object.portal_name;
          this.formData.portal_type = object.portal_type;
          this.formData.portal_menu = object.portal_menu;
          this.imageUrl = object.background_img;
        }
      },
    },
  },

  created() {
    this.fetchPortalType();
    this.fetchPortalMenu();
  },

  methods: {
    fetchPortalType() {
      normalFields('portals_types').then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          this.portalType = data.data;
        }
      });
    },

    fetchPortalMenu() {
      hightFields('top_menus').then(({ data }) => {
        console.log(data);
        if (data.code == 200) {
          this.portalMenu = data.data;
        }
      });
    },

    handleSubmit() {
      const data = _.cloneDeep(this.formData);
      data['background_img'] = this.imageUrl;
      this.$emit('submit', data);
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
  max-width: 135px;
  max-height: 135px;
}
</style>
