<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades">典型案例</i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="s_projectName" placeholder="项目名称" class="handle-input mr10"></el-input>
                <el-select v-model="s_typeId" placeholder="请选择">
                    <el-option value="">全部</el-option>
                    <el-option v-for="item in select" :key="item.id" :label="item.typeName" :value="item.id">
                    </el-option>
                </el-select>

                <el-button type="primary" icon="search" @click="search" style="margin-left: 1%">搜索</el-button>
                <el-button type="primary" icon="add" @click="addInfo">新增</el-button>
            </div>
            <!-- 信息展示 -->
            <el-table :data="tableData" border class="table" ref="multipleTable">
               <el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="projectName" align="center"
                                 label="项目名称"></el-table-column>
                <el-table-column width="120" height="60" align="center" prop="image" label="展示图片">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="scope.row.scope" target="_blank" title="查看最大化图片">
                                <img :src="scope.row.image" style="min-width: 300px;height: 200px; cursor:pointer;">
                            </a>
                            <img slot="reference" :src="scope.row.image"
                                 style="min-width: 80px;height: 80px; cursor:pointer">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="type"
                                 label="服务分类"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="projectIntroduce"
                                 label="项目介绍"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="result"
                                 label="成功效果"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sort"
                                 label="排列顺序"></el-table-column>
                <el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true"
                                 prop="createTime" label="创建时间"></el-table-column>
                <el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
                    <template slot-scope="scp">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scp.$index, scp.row)">查看详情(修改)
                        </el-button>
                        <el-popconfirm
                                title="确认删除此条数据吗？"
                                @onConfirm="handleDelete(scp.$index, scp.row)"
                        >
                            <el-button slot="reference"
                                       type="text"
                                       icon="el-icon-delete"
                                       style="color: #ff4d51!important">删除
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="pageSizes" :page-size="PageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
            </div>
        </div>


        <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
            <el-form ref="courseform" :model="form" :rules="rules">
                <div v-if="active==1">
                    <el-form-item label="项目名称" prop="projectName" style="margin-left: 4%">
                        <el-input v-model="form.projectName" size="mini" class="inputform"
                                  style="width: 30%;margin-left: 1%"></el-input>
                    </el-form-item>
                    <el-form-item label="排序码" prop="sort" style="margin-left: 4%">
                        <el-input v-model="form.sort" size="mini" type="number" class="inputform"
                                  style="width: 30%;margin-left: 2.5%"></el-input>
                    </el-form-item>
                    <el-form-item label="服务分类" prop="typeId" style="margin-left: 4%">
                        <el-select @focus="getType" v-model="form.typeId" placeholder="请选择" style="margin-left: 1%">
                            <el-option v-for="item in select" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width: 300px;margin-left: 4%" label="展示图片">
                        <upload id-name="team"
                                :fileList="fileList"
                                :onUpLoadSuccess="onUpLoadSuccess"
                                :onUpLoadError="onUpLoadError"
                                :filesNumber="1"
                                :showFileList="true"></upload>
                    </el-form-item>
                </div>
                <div v-if="active==2">
                    <el-form-item label="" prop="projectIntroduce">
                        <quill-editor ref="newEditor1" width="80%" height="900px" v-model="form.projectIntroduce"
                                      :options="editorOption"></quill-editor>
                    </el-form-item>
                </div>
                <div v-if="active==3">
                    <el-form-item label="" prop="projectIntroduce">
                        <quill-editor ref="newEditor2" width="80%" height="900px" v-model="form.result"
                                      :options="editorOption"></quill-editor>
                    </el-form-item>
                </div>

                <el-steps :active="active" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="项目介绍"></el-step>
                    <el-step title="成功效果"></el-step>
                </el-steps>
                <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import menu from '../../common/menu';
    import upload from '../../common/Upload.vue';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {
        quillEditor
    } from 'vue-quill-editor';

    export default {
        name: 'client',
        components: {
            quillEditor,
            upload
        },
        data() {
            return {
                active: 1,
                fileList: [],
                s_projectName: '',
                s_typeId: '',
                editorOption: { //富文本参数
                    placeholder: '开始编辑...'
                },
                loading: true,
                dialogFormVisible: false,
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
                //提交表单
                form: {
                    id: '',
                    image: '',
                    projectName: '',
                    projectIntroduce: '',
                    result: '',
                    typeId: '',
                    sort: '0',
                },
                select: [],
                rules: {
                    projectName: [
                        {required: true, message: "请输入项目名称", trigger: "blur"}
                    ],
                    sort: [
                        {required: true, message: "请输排序码", trigger: "blur"}
                    ],
                    typeId: [
                        {required: true, message: "请选择", trigger: "blur"}
                    ],
                },
            };
        },
        created() {
            this.getData();
            this.getType();
        },
        computed: {
            data() {
                return this.tableData;
            },
        },
        methods: {
            next() {
                if (this.active++ > 2) this.active = 1;
            },
            handleDelete(index, row) {
                this.$axios.post(
                    '/client/delete',
                    {id: row.id}
                ).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功')
                        this.getData();
                    }
                })
            },
            saveEdit() {
                if (this.form.image == '' || this.form.image == null) {
                    this.$message.error("未添加图片");
                    return false;
                }
                this.loading = true;
                this.$refs.courseform.validate(valid => {
                    if (valid) {
                        /* 添加 */
                        const subData = this.form;
                        if (this.form.id == '' || this.form.id == null) {
                            delete this.form.id;
                            this.$axios.post('/client/add', this.form).then(res => {
                                if (!res.success) {
                                    this.$message.error(res.errMsg);
                                    this.loading = false;
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.loading = false;
                                this.dialogFormVisible = false;
                            });
                            this.loading = false;
                        } else {
                            this.loading = true;
                            this.$axios.post('/client/update', this.form).then(res => {
                                if (!res.success) {
                                    this.$message.error(res.errMsg);
                                    this.loading = false;
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.dialogFormVisible = false;
                            });
                            this.loading = false;
                        }
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            handleEdit(index, row) {
                this.active=1;
                this.form = row;
                this.fileList = [];
                this.fileList.push({name: row.image, url: row.image});
                this.dialogFormVisible = true;
            },
            formatRowData(row, column) {
                var returnData;
                switch (column.property) {
                    case "createTime":
                        returnData = new Date(row.createTime).format("yyyy/MM/dd");
                        break;
                    case "updateTime":
                        returnData = new Date(row.updateTime).format("yyyy/MM/dd");
                        break;
                }
                return returnData;
            },
            addInfo() {
                this.form = {
                    id: '',
                    image: '',
                    projectName: '',
                    projectIntroduce: '',
                    result: '',
                    typeId: '',
                    sort: '0',
                };
                this.active=1;
                this.fileList = [];
                this.dialogFormVisible = true;
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading = true;
                this.$axios
                    .post('/client/query', {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                        projectName: this.s_projectName,
                        typeId: this.s_typeId,
                    })
                    .then(res => {
                        this.tableData = res.data.records;
                        this.totalCount = res.data.total;
                    });
                this.loading = false;
            },
            getType() {
                this.$axios
                    .post('/backServer/queryBType', {})
                    .then(res => {
                        this.select = res.data;
                    });
            },
            search() {
				this.currentPage = 1;
                this.getData();
            },
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize = val;
                // 点击每页显示的条数时，显示第一页
                this.getData(val, 1);
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage = 1;
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData(this.PageSize, val * this.pageSize);
            },
            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(uploadUrl) {
                this.fileList = [];
                this.fileList.push({name: uploadUrl, url: uploadUrl});
                this.form.image = uploadUrl;
            },
            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                this.$message.error('上传失败')
            },
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

    .mr10 {
        margin-right: 10px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
