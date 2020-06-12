<template>
  <div class="table" v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades">客户列表</i>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="s_name" placeholder="客户名称"  style="margin-right: 2%;width: 10%"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="search" @click="add">添加</el-button>
      </div>
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              v-loading="$store.state.requestLoading"
      >
        <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
        <el-table-column prop="unitName" label="客户名称" align="center"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="type" label="客户类型" align="center"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="phone" label="单位电话" align="center"  :show-overflow-tooltip="true"></el-table-column>
		<el-table-column prop="contacts" label="联系人姓名" align="center"  :show-overflow-tooltip="true"></el-table-column>
		<el-table-column prop="contactPosition" label="联系人职位" align="center"  :show-overflow-tooltip="true"></el-table-column>
		<el-table-column prop="contactPhone" label="联系人电话" align="center"  :show-overflow-tooltip="true"></el-table-column>
		<el-table-column prop="mail" label="联系人邮箱" align="center"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" label="客户地址" align="center"  :show-overflow-tooltip="true"></el-table-column>
        
		<el-table-column prop="remark" label="备注" align="center"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"  :show-overflow-tooltip="true"
                         :formatter="formatDate"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="upd( scope.row)"
            >编辑
            </el-button>
            <el-popconfirm
                    title="确认删除此调数据吗？"
                    @onConfirm="del(scope.row)"
            >
              <el-button slot="reference"
                         type="text"
                         icon="el-icon-delete"
                         style="color: #ff4d51">删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="PageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
        </el-pagination>

      </div>
    </div>

    <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible"
               :close-on-click-modal="closeOnClickModal">
      <el-form ref="courseform" :model="form" :rules="rules">
        <el-form-item label="客户名称" prop="unitName" >
          <el-input v-model="form.unitName" size="mini" class="inputform"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="type">
          <el-input v-model="form.type" size="mini" class="inputform"></el-input>
        </el-form-item>
        <el-form-item label="单位电话"  prop="phone">
          <el-input v-model="form.phone" class="inputform"></el-input>
        </el-form-item>
		<el-form-item label="联系人姓名"  prop="contacts">
		  <el-input v-model="form.contacts" class="inputform"></el-input>
		</el-form-item>
		<el-form-item label="联系人职位"  prop="contactPosition">
		  <el-input v-model="form.contactPosition" class="inputform"></el-input>
		</el-form-item>
		<el-form-item label="联系人电话"  prop="contactPhone">
		  <el-input v-model="form.contactPhone" class="inputform"></el-input>
		</el-form-item>
        <el-form-item label="联系人邮箱" prop="mail" style="margin-left: 1%">
          <el-input v-model="form.mail" class="inputform" ></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address" style="margin-left: 1%">
          <el-input v-model="form.address" class="inputform" ></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" style="margin-left: 1%">
          <el-input v-model="form.remark" class="inputform" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import upLoad from '../../common/Upload'

  export default {
    components: {upLoad},
    name: 'user',
    data() {
      return {
        dialogFormVisible: false,
        form: {
          id: '',
          unitName: '',
          remark: '',
          address: '',
          phone: '',
          mail: '',
          type: '',
          status: 'yes',
        },
        // 总数据
        tableData: [],
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 0,
        // 个数选择器（可修改）
        pageSizes: [10, 20, 50, 100],
        // 默认每页显示的条数（可修改）
        PageSize: 10,
        s_name: "",
        s_phone: "",
        count: 0,
        //检测规则
        rules: {
          unitName: [{
            required: true,
            message: '请填写客户名称',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请选写联系电话',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请填写类型',
            trigger: 'blur'
          }],
          position: [{
            required: true,
            message: '请填职位',
            trigger: 'blur'
          }],
        }
      };
    },
    created() {
      this.getData();
    },
    computed: {
      data() {
        return this.tableData;
      }
    },
    methods: {
      // 每页显示的条数
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.PageSize = val
        // 点击每页显示的条数时，显示第一页
        this.getData(val, 1)
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage = 1
      },
      // 显示第几页
      handleCurrentChange(val) {
        // 改变默认的页数
        this.currentPage = val
        // 切换页码时，要获取每页显示的条数
        this.getData(this.PageSize, (val) * (this.pageSize))
      },
      // 获取 easy-mock 的模拟数据
      getData() {
        this.loading = true;
        this.$axios.post("/organ/query", {
          pageNo: this.currentPage,
          pageSize: this.PageSize,
          name: this.s_name,
        }).then(res => {
          this.tableData = res.data.records;
          this.totalCount = res.data.total;
        });
        this.loading = false;
      },
      search() {
        this.getData();
      },
      formatDate(row) {
        var date = new Date(row.createTime);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD + " " + hh + mm + ss;
      },

      add() {
        this.form = {
          id: '',
          unitName: '',
          remark: '',
          address: '',
          phone: '',
          mail: '',
          status: 'yes',
        };
        this.dialogFormVisible = true;
      },
      saveEdit(formName) {

        this.$refs.courseform.validate(valid => {
          if (valid) {
            /* 添加 */
            if (this.form.id == '' || this.form.id == null) {
              let fd = JSON.parse(JSON.stringify(this.form));
              delete fd.id;
              this.$axios.post('/organ/add', fd).then(res => {
                if (!res.success) {
                  this.$message.error(res.errMsg);
                  return;
                }
                this.$message.success(`操作成功`);
                this.getData();
                this.dialogFormVisible = false;
              });
            } else {
              /* 更新 */
              this.$axios.post('/organ/update', this.form).then(res => {
                if (!res.success) {
                  this.$message.error(res.errMsg);
                  return;
                }
                this.$message.success(`操作成功`);
                this.getData();
                this.dialogFormVisible = false;
              });
            }
            this.active = 0;
          } else {
            console.error('error submit!!');
            return false;
          }
        });
      },
      upd(row){
        this.form=row;
        this.dialogFormVisible = true;
      },
      del(row){
        this.$axios.post('/organ/delete', {id:row.id}).then(res => {
          if (!res.success) {
            this.$message.error(res.errMsg);
            return;
          }
          this.$message.success(`操作成功`);
          this.getData();
          this.dialogFormVisible = false;
        });
      }
    }
  };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 100px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .inputform {
    width: 30%;
    line-height: 40%;

  }
  .querySize {
    width: 200px;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
