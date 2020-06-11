<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">模板分类</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-upload" @click="add" class="handle-input-search">
                    添加分类
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
			<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
                <el-table-column prop="type" label="分类名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"
                                 :formatter="formatDate"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑
                        </el-button>

                        <el-popconfirm
                                title="确认删除此数据吗？"
                                @onConfirm="handleDelete(scope.row)"
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
        </div>

        <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible"  :close-on-click-modal="closeOnClickModal">
            <el-form  ref="courseform" :model="form" :rules="rules" >
                <el-form-item label="分类名称"  prop="type" style="margin-left: 4%">
                    <el-input v-model="form.type" size="mini" class="inputform" style="width: 40%;margin-left: 4%"></el-input>
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
        name: 'templatetype',
        data() {
            return {
                tableData: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    type: '',
                },
                visible: false,
                rules: {
                    type: [
                        {required: true, message: "请输入分类名称", trigger: "blur"}
                    ],
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {

            getData() {
                this.loading = true;
                this.$axios.post("/templateType/query", {
                    pageNo: 1,
                    pageSize: 100000,
                }).then(res => {
                    this.tableData = res.data.records;
                });
                this.loading = false;
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
                    type: '',
                };
                this.dialogFormVisible = true;
            },
            handleEdit(row) {
                this.form = row;
                this.dialogFormVisible = true;
            },
            saveEdit(formName) {
                this.$refs.courseform.validate(valid => {
                    if (valid) {
                        /* 添加 */
                        if (this.form.id == '' || this.form.id == null) {
                            let fd = JSON.parse(JSON.stringify(this.form));
                            delete fd.id;
                            this.$axios.post('/templateType/add', fd).then(res => {
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
                            this.$axios.post('/templateType/update', this.form).then(res => {
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
                this.$axios.post('/templateType/delete',{id:row.id} ).then(res => {
                    if (!res.success) {
                        this.$message.error(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                });
            },
        }
    }
    ;
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
