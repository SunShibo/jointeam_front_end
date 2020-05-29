<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">服务类型</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" icon="el-icon-upload" @click="add" class="handle-input-search">
                添加菜单
            </el-button>
            <div style="margin-top: 2%">
                <el-tree :props="props"
                         :data="data"
                         node-key="id"
                         default-expand-all
                         :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="data.pId==0"
                     type="text"
                     size="mini"
                     icon="el-icon-upload"
                     @click="() => append(data)">
            添加子菜单
          </el-button>
                <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-edit"
                        @click="handleEdit(data)">
            修改
          </el-button>
         <el-popconfirm
                 title="确认删除此菜单吗？"
                 @onConfirm="handleDelete(data)"
         >
                            <el-button slot="reference"
                                       type="text"
                                       icon="el-icon-delete"
                                       style="color: #ff4d51">删除
                            </el-button>
                        </el-popconfirm>
        </span>
      </span>
                </el-tree>
            </div>
        </div>

        <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="courseform" :model="form" :rules="rules">
                <el-form-item label="菜单名称" prop="typeName" style="margin-left: 4%">
                    <el-input v-model="form.typeName" size="mini" class="inputform"
                              style="width: 30%;margin-left: 1%"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="typeName" style="margin-left: 4%">
                    <el-input v-model="form.sort" size="mini" type="number" class="inputform"
                              style="width: 30%;margin-left: 2.5%"></el-input>
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
    import menu from '../../common/menu'
    import upLoad from '../../common/Upload'

    export default {
        name: 'serverType',
        components: {upLoad},
        data() {
            return {
                props: {
                    label: 'typeName',
                    children: 'child',
                    pId: 'pId',
                },
                data: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    pId: '',
                    typeName: '',
                    sort: '0',
                },
                rules: {
                    typeName: [
                        {required: true, message: "请输入名称", trigger: "blur"}
                    ],
                    sort: [
                        {required: true, message: "请输入排序码", trigger: "blur"}
                    ],
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.post("/backServer/queryType", {}).then(res => {
                    this.data = res.data;
                });
            },
            add() {
                this.form = {
                    id: '',
                    pId: '0',
                    sort: '0',
                    typeName: ''
                };
                this.dialogFormVisible = true;
            },
            append(row){
                this.form = {
                    id: '',
                    pId: row.id,
                    sort: '0',
                    typeName:'',
                };
                this.dialogFormVisible = true;
            },
            handleEdit(row) {
                this.form = {
                    id: row.id,
                    pId: row.pId,
                    sort: row.sort,
                    typeName: row.typeName,
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
                            this.$axios.post('/backServer/addType', fd).then(res => {
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
                            this.$axios.post('/backServer/updateType', this.form).then(res => {
                                if (!res.success) {
                                    this.$message.error(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.dialogFormVisible = false;
                            });
                        }
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$axios.post('/backServer/deleteType', {id: row.id}).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                });
            },

        }
    }
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
