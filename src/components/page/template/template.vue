<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">模板配置</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="s_name" placeholder="模板名" class="handle-input"></el-input>
                <el-select v-model="typeId" placeholder="请选择分类" style="margin-right: 1%;margin-left: 1%">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in select"
                            :key="item.id"
                            :label="item.type"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="getData">搜索</el-button>
                <el-button type="primary" icon="el-icon-upload" @click="add" class="handle-input-search">
                    添加模板
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="type" label="分类名称" align="center"></el-table-column>
                <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
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
                        <el-button type="text" icon="el-icon-download" @click="downloadFile(scope.row)">下载附件</el-button>
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

        <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="courseform" :model="form" :rules="rules">
                <el-form-item label="分类名称" prop="typeId" style="margin-left: 4%">
                    <el-select v-model="form.typeId" placeholder="请选择分类" style="margin-right: 1%;margin-left: 1%">
                        <el-option
                                v-for="item in select"
                                :key="item.id"
                                :label="item.type"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板名称" prop="name" style="margin-left: 4%">
                    <el-input v-model="form.name" size="mini" class="inputform"
                              style="width: 30%;margin-left: 1%"></el-input>
                </el-form-item>
                <el-form-item style="width: 300px;margin-left: 5%" label="文件">
                    <upLoad id-name="temp"
                            :fileList="fileList"
                            :onUpLoadSuccess="onUpLoadSuccess"
                            :onUpLoadError="onUpLoadError"
                            :filesNumber="1"
                            :showFileList="true"></upLoad>
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
        name: 'templates',
        components: {upLoad},
        data() {
            return {
                fileList: [],
                s_name: '',
                typeId: '',
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                tableData: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    typeId: '',
                    name: '',
                    path: '',
                },
                visible: false,
                rules: {
                    typeId: [
                        {required: true, message: "请输选择", trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输名称", trigger: "blur"}
                    ],
                },
                select: [],
            };
        },
        created() {
            this.getType();
            this.getData();
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
                this.$axios.post("/backTemplate/query", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    name: this.s_name,
                    typeId: this.typeId
                }).then(res => {
                    this.tableData = res.data.records;
                    this.totalCount = res.data.total;
                });
                this.loading = false;
            },
            getType() {
                this.$axios.post("/templateType/query", {
                    pageNo: 1,
                    pageSize: 100000,
                }).then(res => {
                    this.select = res.data.records;
                });
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
                    typeId: '',
                    name: '',
                    path: '',
                };
                this.fileList=[];
                this.dialogFormVisible = true;
            },
            handleEdit(row) {
                this.form = row;
                this.fileList=[];
                this.fileList.push({name:row.path,url:row.path});
                this.dialogFormVisible = true;
            },
            saveEdit(formName) {
                if( this.form.path == null || this.form.path==''){
                    this.$message.error("未上传文件");
                    return;
                }

                this.$refs.courseform.validate(valid => {
                    if (valid) {
                        /* 添加 */
                        if (this.form.id == '' || this.form.id == null) {
                            let fd = JSON.parse(JSON.stringify(this.form));
                            delete fd.id;
                            this.$axios.post('/backTemplate/add', fd).then(res => {
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
                            this.$axios.post('/backTemplate/update', this.form).then(res => {
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
                this.$axios.post('/backTemplate/delete', {id: row.id}).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                });
            },
            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(uploadUrl) {
                this.fileList = [];
                this.fileList.push({name: uploadUrl, url: uploadUrl});
                this.form.path = uploadUrl;
            },
            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                this.$message.error('上传失败')
            },

            downloadFile(row){
                if(row.path == ""||row.path == null){
                    this.$message.error("没有文件");
                }else{
                    window.location.href=row.path;
                }

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
