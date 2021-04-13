<template>
  <div>
    <vxe-toolbar perfect>
      <template #buttons>
        <div style="margin: 0 10px">
          <el-button type="primary" @click="createLanmu">新增</el-button>
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
          <el-button type="text" @click="updateMenhu(row)">修改</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import { lanmuList, updateLanmu } from '@/network';

export default {
  name: 'page-list',

  data() {
    return {
      tableData: [],
      /** 下拉选择框 栏目类型 */
      lanmuType: '',
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

    createLanmu() {
      console.log('新增栏目');
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

    updateMenhu(row) {
      console.log('更新', row);
    },

    handleDelete(row) {
      console.log('删除', row);
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
