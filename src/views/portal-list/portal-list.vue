<template>
  <div>
    <vxe-toolbar perfect>
      <template #buttons>
        <el-button type="primary" @click="createMenhu">新增</el-button>
      </template>
    </vxe-toolbar>
    <vxe-table ref="xTable" :data="tableData">
      <vxe-table-column title="门户名称" field="portal_name"></vxe-table-column>
      <vxe-table-column title="门户关联菜单" field="portal_menu"></vxe-table-column>
      <vxe-table-column title="所属公司" field=""></vxe-table-column>
      <vxe-table-column title="是否启用" field="is_use" :formatter="enableFormat"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="row['is_use'] == 1" size="mini" type="text" @click="handleDisable(row)">禁用</el-button>
          <el-button v-if="row['is_use'] == 2" size="mini" type="text" @click="handleEnable(row)">停用</el-button>
          <el-button size="mini" type="text" @click="updateMenhu(row)">修改</el-button>
          <el-button size="mini" type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import { deleteMenhu, menhuList, updateMenhu } from '@/network';

const data = {
  code: '200',
  '~table~': 'lx_sys_portals',
  data: [
    {
      portal_name: '测试门户名称1',
      updated_utc_datetime: null,
      updated_by: '',
      id: 1,
      is_use: '1',
      background_img: '',
      uuid: '5e1ef6a4-3018-4430-b992-24e55599c70b',
      created_by: 1,
      created_utc_datetime: 1616047874000,
      portal_menu: '04bea7e1-235b-494f-ac94-bbeef23f03d5',
    },
    {
      portal_name: '测试门户名称2X',
      updated_utc_datetime: 1616053686000,
      updated_by: 1,
      id: 9,
      is_use: '2',
      background_img: '',
      uuid: '6781cfce-e517-44c3-bee0-5163760e7624',
      created_by: 1,
      created_utc_datetime: 1616051161000,
      portal_menu: '04bea7e1-235b-494f-ac94-bbeef23f03d5',
    },
  ],
  systemFieldMeta: [],
  status: 'success',
  msg: '成功',
};

export default {
  data() {
    return {
      tableData: [],
    };
  },

  created() {
    this.fetchTableData();
  },

  methods: {
    /**
     * 请求表格数据
     */
    fetchTableData() {
      /* menhuList()
        .then((response) => {
          const { data } = response;

          if (data.code == 200) {
            this.tableData = data.data;
          }
        })
        .catch((error) => {
          console.warn(error.message);
        }); */

      this.tableData = data.data;
    },

    /**
     * 禁用门户
     */
    handleDisable(row) {
      row = _.cloneDeep(row);
      row['is_use'] = '2';
      updateMenhu(row)
        .then((response) => {
          const { data } = response;

          if (data.code == 200) {
            console.log(data.data);
          }
        })
        .catch((error) => {
          console.warn(error.message);
        });
    },

    /**
     * 启用门户
     */
    handleEnable(row) {
      row = _.cloneDeep(row);
      row['is_use'] = '1';
      updateMenhu(row)
        .then((response) => {
          const { data } = response;

          if (data.code == 200) {
            console.log(data.data);
          }
        })
        .catch((error) => {
          console.warn(error.message);
        });
    },

    createMenhu() {
      this.$router.push('/update-portal/create');
    },

    /**
     * 更新门户
     */
    updateMenhu({ uuid }) {
      this.$router.push(`/update-portal/update/${uuid}`);
    },

    /**
     * 删除门户
     */
    handleDelete({ uuid }) {
      deleteMenhu({ '~table~': 'lx_sys_portals', uuid })
        .then(({ data }) => {
          if (data.code == 200) {
            this.$message.success(data.msg);
            this.fetchTableData();
          }
        })
        .catch(({ message }) => {
          console.warn(message);
        });
    },

    /**
     * 单元格格式化 启用/停用
     */
    enableFormat({ cellValue }) {
      if (cellValue == 1) return '启用';
      if (cellValue == 2) return '停用';
      return cellValue;
    },
  },
};
</script>
