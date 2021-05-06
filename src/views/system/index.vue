<template>
  <div class="app-container">
    <lx-button ref="buttonRef" :init="init" :rowButtonArray="buttonData">
      <lx-advance-filter
        v-model="systemSeniorQueryString"
        @success="$refs.buttonRef().getData()"
        :systemFieldMeta="systemFieldMeta"
      >
      </lx-advance-filter
    ></lx-button>
    <lx-table
      :data="data"
      @selection-change="handleSelectionChange"
      @turnPage="changePage"
      :head_arr="header_title"
      :cpage="cpage"
      :pagesize="pageSize"
      :total="total"
      :selection="true"
    >
      <template v-slot:lx-action="{ scope }">
        <template v-for="(item, index) in buttonData">
          <el-button
            v-if="scope.row.type_group != 'DataList' && scope.row.is_valid != '0'"
            size="mini"
            type="text"
            :key="index"
            icon="el-icon-edit"
            @click="$refs.buttonRef.buttonClick(item, scope.row)"
            >{{ item.button_title }}</el-button
          >
        </template>
      </template>
    </lx-table>
  </div>
</template>

<script>
// import { get } from "@/api/public.js";
export default {
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      loading:undefined,
      // 显示搜索条件
      showSearch: true,
      buttonData: [],
      data: [],

      // 列表选中行
      tableSelectRows: [],
      header_title: [
        {
          label: "报表名称",
          width: "auto",
          align: "center",
          key: "report_name",
        },
        {
          label: "报表类型",
          width: "auto",
          align: "center",
          key: "type_name",
        },
      ],
      systemSeniorQueryString: [],
      systemFieldMeta: [],
      field_alias_name:"",
      table_alias_name:"",
      cpage: 1,
      pageSize: 20,
      total: 0,
    };
  },
  created() {
    this.cpage = 1;
    this.pageSize = 20;
  },
  computed: {
    init() {
      return {
        query_param: {
          cpage: this.cpage,
          pagesize: this.pageSize,
          systemSeniorQueryString: this.systemSeniorQueryString,
          field_alias_name: this.field_alias_name,
          table_alias_name: this.table_alias_name,
        },
        method: "getList",
        loading:'loading'
      };
    },
  },
  methods: {
    buttonLoding(val) {
      if (val) {
        this.getList();
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.tableSelectRows = val;
    },
    onOpen() {},
    onClose() {
      this.$refs["addEditMenu"].resetFields();
    },
    changePageStatus(val) {
      this.pageStatus = val;
    },
    close() {
      this.changePageStatus("list");
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["addEditMenu"].validate((valid) => {
        if (!valid) return;
        this.close();
      });
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    changePage(param) {
      this.cpage = param.cpage;
      this.pageSize = param.pagesize;
    },
    /** 查询菜单列表 */
    getList(res) {
      if (res && res.code == 200) {
        this.data = res.data;
        this.total = res.totalCount;

        this.systemFieldMeta = res.systemFieldMeta;
        console.log(this.systemFieldMeta);
      }
      if(this.loading){
        this.loading=false;
      }
    },
  },
};
</script>
