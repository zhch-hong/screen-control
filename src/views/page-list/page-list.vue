<template>
  <div>
    <vxe-toolbar perfect>
      <template #buttons>
        <div style="margin: 0 10px">
          <el-dropdown @command="createLanmu">
            <el-button type="primary">新增栏目<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="list">列表栏目</el-dropdown-item>
              <el-dropdown-item command="link">链接栏目</el-dropdown-item>
              <el-dropdown-item command="chart">图表栏目</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <template #tools>
        <div style="margin: 0 10px">
          <el-select v-model="lanmuType">
            <el-option label="列表" value="1"></el-option>
            <el-option label="图表" value="2"></el-option>
            <el-option label="链接" value="3"></el-option>
          </el-select>
        </div>
      </template>
    </vxe-toolbar>
    <vxe-table ref="xTable" :data="tableData">
      <vxe-table-column type="checkbox" width="100" align="center"></vxe-table-column>
      <vxe-table-column title="栏目名称" field="page_name"></vxe-table-column>
      <vxe-table-column title="栏目类型" field="page_type" :formatter="typeFormat"></vxe-table-column>
      <vxe-table-column title="创建人" field="created_by"></vxe-table-column>
      <vxe-table-column title="是否启用" field="is_use" :formatter="enableFormat"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="row['is_use'] == 1" type="text" @click="handleEnable(row, 2)">停用</el-button>
          <el-button v-else type="text" @click="handleEnable(row, 1)">启用</el-button>
          <el-button type="text" @click="updateLanmu(row)">修改</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <ListConfig
      :visible="listUpdateVisible"
      :config="updateLanmuConfig"
      @update:visible="(v) => (listUpdateVisible = v)"
      @submit="listconfigSubmit('list', $event)"
    />
  </div>
</template>
<script>
import _ from 'lodash';
import { createLanmu, lanmuList, updateLanmu, lanmuData } from '@/network';

import ListConfig from './components/ListConfig.vue';

export default {
  name: 'page-list',

  components: { ListConfig },

  data() {
    return {
      tableData: [],
      /** 查询条件下拉选择框栏目类型 */
      lanmuType: '',
      /** 点击更新栏目的配置数据 */
      updateLanmuConfig: null,
      /** 列表栏目更新dialog */
      listUpdateVisible: false,
    };
  },

  created() {
    this.fetchLanmulist();
  },

  methods: {
    fetchLanmulist() {
      lanmuList({ '~table~': 'lx_sys_pages' })
        .then(({ data }) => {
          if (data.code == 200) {
            this.tableData = data.data;
          }
        })
        .catch(({ message }) => {
          this.$error(message);
        });
    },

    createLanmu(params) {
      console.log('新增栏目', params);
      if (params === 'list') {
        this.listUpdateVisible = true;
      }
    },

    /**
     * 更新栏目
     * 更新栏目的启用/停用
     */
    handleEnable(row, value) {
      const {
        uuid,
        page_name,
        page_type,
        show_column_name,
        chart_name,
        link_address,
        data_source,
        show_line,
        click_view,
        click_view_more,
        is_refresh_button,
        is_show_underline,
        is_more_button,
        is_add_button,
        new_url,
        is_show_title,
        title_name,
      } = row;

      const data = {
        '~table~': 'lx_sys_pages',
        uuid,
        page_name,
        page_type,
        is_use: value.toString(),
        show_column_name,
        chart_name,
        link_address,
        data_source,
        show_line,
        click_view,
        click_view_more,
        is_refresh_button,
        is_show_underline,
        is_more_button,
        is_add_button,
        new_url,
        is_show_title,
        title_name,
      };

      console.log(value, JSON.parse(JSON.stringify(data)));
      updateLanmu(data)
        .then(({ data }) => {
          if (data.code == 200) {
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(({ message }) => {
          this.$error(message);
        });
    },

    updateLanmu(row) {
      const { uuid } = row;

      lanmuData({
        '~table~': 'lx_sys_pages',
        uuid,
      }).then(({ data }) => {
        if (data.code == 200) {
          console.log('更新栏目', data);
          this.updateLanmuConfig = _.cloneDeep(data.data);
          const { page_type } = data.data;
          if (page_type == 1) this.listUpdateVisible = true;
        }
      });
    },

    handleDelete(row) {
      console.log('删除', row);
    },

    listconfigSubmit(type, params) {
      if (this.updateLanmuConfig) {
        // 更新
        const _params = _.cloneDeep(params);
        _params['~table~'] = 'lx_sys_pages';

        updateLanmu(_params).then(({ data }) => {
          console.log('更新栏目', JSON.parse(JSON.stringify(_params)), JSON.parse(JSON.stringify(data)));
        });
      } else {
        const _params = Object.assign(
          {
            '~table~': 'lx_sys_pages',
            page_type: type,
            is_use: '1',
          },
          params
        );
        createLanmu(_params)
          .then(({ data }) => {
            console.log('新增栏目', JSON.parse(JSON.stringify(_params)), JSON.parse(JSON.stringify(data)));
            if (data.code == 200) {
              this.listUpdateVisible = false;
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            //
          });
        // 新增
      }
    },

    typeFormat({ cellValue }) {
      if (cellValue == '1') return '列表';
      if (cellValue == '2') return '图表';
      if (cellValue == '3') return '链接';
      return cellValue;
    },

    enableFormat({ cellValue }) {
      if (cellValue == '1') return '启用';
      if (cellValue == '2') return '停用';
      return cellValue;
    },
  },
};
</script>
