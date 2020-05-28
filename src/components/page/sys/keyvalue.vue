<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">参数配置</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="values" label="值" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="comment" label="备注" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible"  width="30%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form"  :rules="rules"   label-width="100px">
                <el-form-item required="" label="值"  prop="values" >
                    <el-input v-model="form.values" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading"  @click="saveEdit('form')" >确 定</el-button>
             </span>

        </el-dialog>

        <!-- 图片替换 -->
        <el-dialog title="编辑" :visible.sync="imgVisible" width="40%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <UpLoad
                        class="upload"
                        drag="true"
                        idName="dateId"
                        :onUpLoadSuccess="imgsuccess3"
                        :onUpLoadRemove="imgRemove3"
                        :onUpLoadError="onUpLoadError"
                        :multiple="true"
                        :drag="true"
                        :show-file-list="true"
                        accept="image/*"
                        :fileList="datelist"
                        :filesNumber="7"
                >
                </UpLoad>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="imgVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    import UpLoad from '../../common/Upload.vue';

    export default {
        name: 'param1',
        components: {UpLoad},
        data() {
            return {
                datelist: [],
                imgVisible: false,
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    values: "",
                },
                rules: {
                    values: [
                        { required: true, message: "请输入", trigger: "blur" }
                    ],
                },
                idx: -1
            };
        },
        created() {
            this.getData();

        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/syskv/query").then(res => {
                    this.tableData=res.data;
                });
            },
            handleEdit(index, row) {
                this.form = {
                    id: row.id,
                    values: row.values
                };
                if (row.id == 2) {
                    this.idx = index;
                    this.editVisible = true;
                } else {
                    this.datelist = [{
                        name: row.values,
                        url: row.values
                    }];
                    this.imgVisible = true;
                }
            },
            // 保存编辑
            saveEdit(formName) {
                if(this.form.values=='' || this.form.values==null ){
                    console.error("error submit!!");
                    return ;
                }
                delete this.form.key;
                let fd = JSON.parse(JSON.stringify(this.form));
                this.$axios.post("/syskv/update", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.editVisible = false;
                    this.imgVisible = false;
                });
            },
            imgsuccess3(res, file) {
                this.form.values = res;
            },
            imgRemove3(file, fileList) {
            },
            onUpLoadError(err) {
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
        }
    };
</script>

<style scoped>

    .table {
        width: 100%;
        font-size: 14px;
    }

</style>
