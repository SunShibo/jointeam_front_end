<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table v-loading="$store.state.requestLoading" :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="50">
                </el-table-column>
                <el-table-column prop="roleName" label="名称" width="120">
                </el-table-column>
                <el-table-column prop="menuNames" label="菜单权限">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p> {{ scope.row.menuNames|dealRole }}</p>
                            <div slot="reference" class="name-wrapper">
                                <p class="ellipsis">{{scope.row.menuNames|showRole}}</p>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" top="5vh" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="id">
                            <el-input v-model="form.id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="roleName"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                            <el-input v-model="form.roleName"></el-input>
                        </el-form-item>

                        <el-form-item label="菜单权限">
                            <div style="height:400px;overflow:auto">
                                <el-tree
                                        :data="menu"
                                        show-checkbox
                                        node-key="id"
                                        ref="tree"
                                        :default-expand-all="true"
                                        :props="defaultProps">
                                </el-tree>
                            </div>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'role',
        data() {
            return {
				loading: true,
				
                tableData: [],//列表数据
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    roleName: '',
                    id: '',
                    menuIds: '',
                    des: '',
                    roleId: '',
                    languageId: []
                },
                idx: -1,
                menu: [],
                defaultProps: {
                    children: 'ch',
                    label: 'menuName'
                },
                languageProps: {
                    label: 'languageName'
                }

            }
        },
        created() {
            this.getData();
            this.getMenuData();
        },
        filters: {
            dealRole(row){
                return row.join(" ， ");
            },
            showRole(val){
                let str, oldStr = val.join(',');
                if(oldStr.length>=25){
                    str = oldStr.substr(0,25)+"......";
                }else {
                    return oldStr;
                }
                return str;
            }
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            //获取角色信息列表
            getData() {
				this.loading = true;
                this.$axios.post("/admin/getAllRoleMenu", {
                    roleName: this.select_word.trim()
                }).then((res) => {
                    if(res.success){
                        this.tableData = res.data;
						this.loading = false;
                    }
                });
				this.loading = false;
            },
            //获取所有菜单
            getMenuData() {
				this.loading = true;
                this.$axios.post("/admin/getMenuList", {}).then((res) => {
                    this.menu = res.data;
                })
				this.loading = false;
            },
            search() {
                this.getData();
            },
            add() {
                //添加
                this.editVisible = true;
                this.form = {
                    roleName: '',
                    id: '',
                    menuIds: '',
                }
                setTimeout(() => {
                    this.$refs.tree.setCheckedKeys([]);
                }, 200)

            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    roleName: item.roleName,
                    id: item.id,
                    menuIds: item.menuIds,
                    // des: item.des
                };
                this.editVisible = true;
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(item.menuIds);
                })
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                if (length == 0)return;
                if (!confirm(`您确定要删除 ${length} 条数据吗？`))return;
                let str = [];
                // this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str.push(this.multipleSelection[i]['id']);
                }
				this.loading = true;
                this.$axios.post("/admin/delRoleByIds", {roleIds: str.join(",")}).then((res) => {
                    if (!res.success) {
                        this.$message.error(res.errMsg);
						this.loading = false;
                        return;
                    }

                    this.$message.success('删除成功');
                    this.delVisible = false;
                    this.getData();
                });
				this.loading = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            unique(arr) {
                const res = new Map();
                return arr.filter((a) => !res.has(a) && res.set(a, 1))
            },
            // 保存编辑
            saveEdit() {
                var self = this;
                this.form.menuIds = this.$refs.tree.getCheckedKeys();
                var newlist = [];
                for (var i = 0; i < this.form.menuIds.length; i++) {
                    if (self.$refs.tree.getNode(this.form.menuIds[i]).parent.data.id) {
                        newlist.push(self.$refs.tree.getNode(this.form.menuIds[i]).parent.data.id)
                    }
                }
                newlist = this.unique(newlist);
                this.form.menuIds = this.form.menuIds.concat(newlist)
                this.form.menuIds = this.unique(this.form.menuIds);
                this.form.menuIds = this.form.menuIds.join(",")
                if (this.form.id == "") {
                    this.form.languageId = JSON.stringify(this.form.languageId);
                    //新增角色
                    let fd = JSON.parse(JSON.stringify(this.form));
                    delete fd.id;
                    delete fd.des;
					this.loading = true;
                    this.$axios.post("/admin/addRoleGrantAuthority", fd).then((res) => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
							this.loading = false;
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });
					this.loading = false;
                } else {
                    //编辑角色
                    this.form.roleId = this.form.id;
                    this.form.languageId = JSON.stringify(this.form.languageId);
                    delete this.form.id;
					this.loading = true;
                    this.$axios.post("/admin/grantAuthority", this.form).then((res) => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
							this.loading = false;
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });
					this.loading = false;
                }
            },
            // 确定删除
            deleteRow(){
				this.loading = true;
                this.$axios.post("/admin/delRoleByIds", {roleIds: this.form.id}).then((res) => {
                    if (!res.success) {
                        this.$message.error(res.errMsg);
						this.loading = false;
                        return;
                    }
                    this.tableData.splice(this.idx, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false;
                });
				this.loading = false;

            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>
