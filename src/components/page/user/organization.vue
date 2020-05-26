<template>
  <div class="table" v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades">用户管理</i>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="s_name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-input v-model="s_phone" placeholder="手机号" class="querySize"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              v-loading="$store.state.requestLoading"
      >
        <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="头像">
              <template slot-scope="scope">
                  <img :src="scope.row.headPic" width="100" height="100" />
              </template>
          </el-table-column>
        <el-table-column prop="name" label="用户名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
        <el-table-column prop="createTime" label="注册时间"  align="center" :formatter="formatDate"></el-table-column>
        <el-table-column prop="birthday" label="生日" align="center" :formatter="formatBir"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="queryPatriarch( scope.row)"
            >查看家长信息</el-button>
              <el-button
                      type="text"
                      icon="el-icon-edit"
                      @click="queryStudent(scope.row)"
              >查看学员信息</el-button>
              <el-button
                      type="text"
                      icon="el-icon-edit"
                      @click="queryAddress(scope.row)"
              >查看地址</el-button>
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

    <!-- 家长信息 -->
    <el-dialog title="查看家长信息" :visible.sync="visible" width="50%">
      <div>
        <el-table
                :data="patriarch"
                border
                class="table"
                ref="multipleTable"
                v-loading="$store.state.requestLoading"
        >
          <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" ></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="createTime" label="注册时间" :formatter="formatDate"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" visible = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 学员信息 -->
    <el-dialog title="查看学员信息" :visible.sync="student" width="50%">
      <div>
        <el-table
                :data="studentData"
                class="table"
                ref="multipleTable"
                v-loading="$store.state.requestLoading"
        >
          <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.pic" width="100" height="100" />
            </template>
          </el-table-column>
          <el-table-column prop="studentName" label="姓名" align="center" ></el-table-column>
          <el-table-column prop="studentSex" label="性别"></el-table-column>
          <el-table-column prop="birthday" label="生日" :formatter="formatBir"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" student = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 地址信息 -->
    <el-dialog title="查看地址" :visible.sync="address" width="50%">
      <div>
        <el-table
                :data="addressData"
                class="table"
                ref="multipleTable"
                v-loading="$store.state.requestLoading"
        >
          <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
          <el-table-column prop="communityName" label="名称" align="center" ></el-table-column>
          <el-table-column prop="addressInfo" label="详细地址" :show-overflow-tooltip="true"  align="center" ></el-table-column>
          <el-table-column prop="isDefault" label="是否默认" :formatter="addStatus" align="center" ></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" address = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import menu from '../../common/menu'
  export default {
    name: 'user',
    data() {
      return {
		 loading: true,
		  
        address:false,
        addressData:[],
        student:false,
        studentData:[],
          visible:false,
        // 总数据
        tableData:[],
        // 默认显示第几页
        currentPage:1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount:0,
        // 个数选择器（可修改）
        pageSizes:[10,20,50,100],
        // 默认每页显示的条数（可修改）
        PageSize:10,
        s_name:"",
        s_phone:"",
        patriarch:[],
        count: 0,
        rules: {
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getData();
    },
    computed: {
      data() {
        return this.tableData;
      },
      total() {
        return this.count;
      }
    },
    methods: {
      // 每页显示的条数
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.PageSize=val
        // 点击每页显示的条数时，显示第一页
        this.getData(val,1)
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage=1
      },
      // 显示第几页
      handleCurrentChange(val) {
        // 改变默认的页数
        this.currentPage=val
        // 切换页码时，要获取每页显示的条数
        this.getData(this.PageSize,(val)*(this.pageSize))
      },

      // 获取 easy-mock 的模拟数据
      getData() {
		  this.loading = true;
        this.$axios.post("/userInfo/queryUserInfo", {
          pageNo:this.currentPage,
          pageSize:this.PageSize,
          phone:this.s_phone,
          name:this.s_name,
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
        let time = new Date(row.createTime);
        return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
                .getMinutes() + ":" + time.getSeconds();
      },
      formatBir(row){
        let time = new Date(row.birthday);
        return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() ;
      },
      queryPatriarch(row){
		  this.loading = true;
        this.$axios.post("/userContact/queryContectByUserId", {
          userId:row.id,
        }).then(res => {
          this.patriarch = res.data;
        });
		this.loading = false;
        this.visible=true;
      },
      queryStudent(row){
		  this.loading = true;
        this.$axios.post("/studentBack/query", {
          userId:row.id,
        }).then(res => {
          this.studentData = res.data;
        });
		this.loading = false;
        this.student=true;
      },
      queryAddress(row){
		  this.loading = true;
        this.$axios.post("/address/queryAddressByUserId", {
          userId:row.id,
        }).then(res => {
          this.addressData = res.data;
          console.log(res.data);
        });
		this.loading = false;
        this.address=true;
      },
      addStatus(row){
        return row.isDefault=='yes'?"是":"否";
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
  .red {
    color: #ff0000;
  }
  .querySize {
   width: 200px;
   margin-left: 10px;
   margin-right: 10px;
  }
</style>
