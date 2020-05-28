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
                <el-select v-model="s_value" placeholder="请选择" style="margin-right: 2%">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.unitName"
                            :value="item.id">
                    </el-option>
                </el-select>
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
                <el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="头像" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.head" width="70" height="70"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="用户名" align="center" width="90"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="company" label="机构" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="weChat" label="微信号" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="mailbox" label="邮箱" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="birthday" label="生日" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="70"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="upd(scope.row)"
                        >编辑
                        </el-button>
                        <el-popconfirm
                                title="确认禁用此用户吗？"
                                @onConfirm="handleDelete(scope.row)"
                        >
                            <el-button slot="reference" v-if="scope.row.status=='yes'"
                                       type="text"
                                       icon="el-icon-delete"
                                       style="color: #ff4d51">禁用
                            </el-button>
                            <el-button slot="reference" v-if="scope.row.status=='no'"
                                       type="text"
                                       icon="el-icon-delete"
                                       style="color: #ff4d51">启用
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
                <el-row>
                    <el-col :span="12" style="border-right: 1px #666666 solid">
                        <div class="grid-content bg-purple">

                            <el-form-item label="姓名：" prop="name">
                                <el-input style="width: 300px" v-model="form.name" size="mini"
                                          class="inputform"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="phone">
                                <el-input style="width: 300px" v-model="form.phone" size="mini"
                                          class="inputform"></el-input>
                            </el-form-item>
                            <el-form-item label="机构：" prop="companyId">
                                <el-select v-model="form.companyId" placeholder="请选择" style="margin-right: 2%">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.id"
                                            :label="item.unitName"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width: 300px" label="头像">
                                <upLoad id-name="team"
                                        :fileList="fileList"
                                        :onUpLoadSuccess="onUpLoadSuccess"
                                        :onUpLoadError="onUpLoadError"
                                        :filesNumber="1"
                                        :showFileList="true"></upLoad>
                            </el-form-item>

                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple" style="margin-left: 60px">
                            <el-form-item label="微信号">
                                <el-input style="width: 300px" v-model="form.weChat" size="mini"
                                          class="inputform"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：">
                                <el-input style="width: 300px" v-model="form.mailbox" size="mini"
                                          class="inputform"></el-input>
                            </el-form-item>
                            <el-form-item label="性别：">
                                <el-radio v-model="form.sex" label="男">男</el-radio>
                                <el-radio v-model="form.sex" label="女">女</el-radio>
                            </el-form-item>
                            <el-form-item label="生日：">
                                <el-date-picker
                                        v-model="form.birthday"
                                        format="yyyy/MM/dd"
                                        value-format="yyyy/MM/dd"
                                        type="date"
                                        placeholder="选择生日">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>

                </el-row>

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
        name: 'user',
        components: {upLoad},
        data() {
            return {
                fileList: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    name: '',
                    phone: '',
                    companyId: '',
                    weChat: '',
                    mailbox: '',
                    head: '',
                    sex: '男',
                    birthday: '',
                    status: 'yes',
                },

                loading: true,
                address: false,
                addressData: [],
                student: false,
                studentData: [],
                visible: false,
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
                s_value: "",
                patriarch: [],
                count: 0,
                rules: {
                    companyId: [
                        {required: true, message: "请输选择", trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入姓名", trigger: "blur"}
                    ],
                    phone: [
                        {required: true, message: "请输入手机号", trigger: "blur"}
                    ],
                },
                options: [],
            };
        },
        created() {
            this.getData();
            this.getSelect();
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
                this.$axios.post("/backUser/query", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    phone: this.s_phone,
                    name: this.s_name,
                    companyId: this.s_value,
                }).then(res => {
                    this.tableData = res.data.records;
                    this.totalCount = res.data.total;
                });
                this.loading = false;
            },
            getSelect() {
                this.$axios.post("/organ/queryByWechatId", {}).then(res => {
                    this.options = res.data;
                });
            },
            search() {
                this.getData();
            },
            formatDate(row) {
                let time = new Date(row.createTime);
                return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
                    .getMinutes() + ":" + time.getSeconds();
            },
            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(uploadUrl) {
                console.log(uploadUrl)
                this.fileList = [];
                this.fileList.push({name: uploadUrl, url: uploadUrl});
                this.form.head = uploadUrl;
            },
            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                console.log(err)
                this.$message.error('上传失败')
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
                this.fileList = [];
                this.form = {
                    id: '',
                    name: '',
                    phone: '',
                    companyId: '',
                    weChat: '',
                    mailbox: '',
                    head: '',
                    sex: '男',
                    birthday: '',
                    status: 'yes',
                };
                this.dialogFormVisible = true;
            },
            upd(row) {
                this.fileList = [];
                this.fileList.push({name: row.head, url: row.head});
                this.form = row;
                this.dialogFormVisible = true;
            },
            saveEdit(formName) {
                if (this.form.head == '' || this.form.head == null) {
                    this.$message.error("未添加图片");
                    return false;
                }

                this.$refs.courseform.validate(valid => {
                    if (valid) {
                        /* 添加 */
                        if (this.form.id == '' || this.form.id == null) {
                            let fd = JSON.parse(JSON.stringify(this.form));
                            delete fd.id;
                            this.$axios.post('/backUser/add', fd).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.dialogFormVisible = false;
                            });
                        } else {
                            /* 更新 */
                            this.$axios.post('/backUser/update', this.form).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
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
                /* 更新 */
                this.$axios.post('/backUser/delete',{id:row.id} ).then(res => {
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
