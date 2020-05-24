<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-upload" @click="addBanner" class="handle-input-search">
                    添加Banner
                </el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
                <el-table-column label="Banner">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="scope.row.scope" target="_blank" title="查看最大化图片">
                                <img :src="scope.row.image" style="min-width: 300px;">
                            </a>
                            <img slot="reference" :src="scope.row.image"
                                 style="min-width: 120px;height: 70px; cursor:pointer">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="skip" label="跳转方式" align="center" :formatter="skip"></el-table-column>
                <el-table-column prop="skipPath" label="跳转路径" align="center"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"  :formatter="timeFormatter"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>

                        <el-popconfirm
                                title="这是一段内容确定删除吗？"
                                @onConfirm="handleDelete(scope.$index, scope.row)"
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

        <el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :before-close="beforeClose">
            <el-form>
                <el-select v-model="form.skip" placeholder="请选择跳转类型"  @change="change">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-form-item label="跳转路径" v-if="!path" >
                    <el-input v-model="form.skipPath"  type="number" size="mini" class="inputform"></el-input>
                </el-form-item>
                <el-form-item label="跳转路径" v-if="path" >
                    <el-input v-model="form.skipPath" class="inputform"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <upLoad idName="banner"
                            :fileList="fileList"
                            :onUpLoadSuccess="onUpLoadSuccess"
                            :onUpLoadError="onUpLoadError"
                            :filesNumber="1"
                            :showFileList="false"></upLoad>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="loadData">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import upLoad from '../../common/Upload'

    export default {
        name: "banner",
        components: {upLoad},
        data() {
            return {
                tableData: [],
                path:false,
                multipleSelection: '',
                dialogFormVisible: false,
                form:{
                    id:'',
                    skip:'',//跳转方式
                    skipPath:'',// 跳转路径 或 id
                    image:'',
                    sort:'',
                },
                tid: 0,
                id: 0,
                uploadUrl: '',
                fileList: [],
                options: [{
                    value: 'page',
                    label: '网页'
                }, {
                    value: 'politics',
                    label: '政治解读'
                }, {
                    value: 'industry',
                    label: '行业资讯'
                }, {
                    value: 'serve',
                    label: '服务详情'
                }, {
                    value: 'client',
                    label: '客户成功'
                }],
                value: ''
            }

        },
        created() {
            this.getData();
        },
        methods: {
            change(value){
                if(value!='page'){
                    this.path=false;
                }else {
                    this.path=true;
                }
            },
            timeFormatter(row){
                var date = new Date(row.createTime);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return YY + MM + DD +" "+hh + mm + ss;
            },
            skip(row) {
                if (row.skip == 'page') {
                    return "网页";
                }
                if (row.skip == 'politics') {
                    return "政治解读";
                }
                if (row.skip == 'industry') {
                    return "行业资讯";
                }
                if (row.skip == 'serve') {
                    return "服务详情";
                }
                if (row.skip == 'client') {
                    return "客户成功";
                }
            },
            loadData() {
                if (this.uploadUrl && this.id) {//修改
                    this.$axios.post(
                        '/banner/updBan',
                        {id: this.id, tId: this.tid, img: this.uploadUrl}
                    ).then(res => {
                        if (res.success) {
                            this.$message.success('修改成功');
                            this.fileList = [];
                            this.getData()
                        }
                    })
                } else {//添加
                    this.$axios.post(
                        '/banner/addBan',
                        {tId: this.tid, img: this.uploadUrl}
                    ).then(res => {
                        if (res.success) {
                            this.$message.success('上传成功');
                            this.fileList = []
                            this.getData()
                        }
                    })
                }
            },

            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(uploadUrl) {
                console.log(uploadUrl)
                this.uploadUrl = uploadUrl;
            },

            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                console.log(err)
                this.$message.error('上传失败')
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            /**
             * 添加banner
             */
            addBanner() {
                this.dialogFormVisible = true
            },
            /**
             * 编辑
             * @param index
             * @param row
             */
            handleEdit(index, row) {
                this.id = row.id, this.tid = row.tid, this.uploadUrl = row.img;
                this.dialogFormVisible = true
            },

            /**
             * 删除
             * @param index
             * @param row
             */
            handleDelete(index, row) {
                this.$axios.post(
                    '/banner/delBan',
                    {id: row.id}
                ).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功')
                        this.getData();
                    }
                })
            },
            //关闭dialog前事件
            beforeClose(done) {
                this.tid = '';
                this.id = 0;
                this.uploadUrl = ''
                done();
            },
            getData() {
                this.$axios.post('/banner/selectAll').then(res => {
                    this.tableData = res.data
                })
            },

        }
    }
</script>
<style>
    .table {
        margin-top: 1%;
    }
    .inputform{
        width: 50%;

    }

</style>
