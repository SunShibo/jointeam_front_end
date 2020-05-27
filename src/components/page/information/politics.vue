<template>
    <!-- 发现详情模块 -->
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 发现模块</el-breadcrumb-item>
                <el-breadcrumb-item>发现文章{{id?'修改':'添加'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :model="form" label-width="120px" ref="Article" class="demo-form-inline">
                    <el-form-item>
                        <el-button style="position: absolute;top: 0;right: 20px" type="primary" @click="onSubmit">保存
                        </el-button>
                    </el-form-item>
                    <el-form-item label="文章类型">
                        <el-radio-group v-model="form.type">
                            <el-radio label="journalism">文本文章</el-radio>
                            <el-radio label="curriculum">视频文章</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文章标题" prop="title"
                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                        <el-input style="width: 250px" v-model="form.title" placeholder="文章标题"
                                  class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item label="文章描述" prop="description"
                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                        <el-input
                                style="width: 250px;"
                                type="textarea"
                                :autosize="{minRows: 2}"
                                placeholder="请输入文章描述"
                                v-model="form.description">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="是否置顶">
                        <el-checkbox v-model="stickCheckBox"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="展示方式">
                        <el-radio-group v-model="form.way">
                            <el-radio label="leftrightrank">左右排序</el-radio>
                            <el-radio label="upbelowrank">上下排序</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="上传封面图" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]"
                                  prop="thumbnail">
                        <UpLoad
                                idName="thumbnail12"
                                :onUpLoadSuccess="thumbnailSuccess"
                                :onUpLoadError="onUpLoadError"
                                :multiple="false"
                                :drag="true"
                                accept="image/*"
                                :fileList="fileList"
                                refUpLoad="thumbnail12"
                                listType="picture"></UpLoad>
                    </el-form-item>
                    <el-form-item label="上传视频" :rules="form.type=='curriculum'?[{required: true, message: '该项不能为空', trigger: 'change'}]:[]"
                                  prop="video">
                        <UpLoad
                                idName="videoFile"
                                :onUpLoadSuccess="videoSuccess"
                                :onUpLoadBeforeUpload="videoBeforeUpLoad"
                                :onUpLoadError="onUpLoadError"
                                :multiple="false"
                                :videoType="form.type"
                                :drag="true"
                                accept="video/*"
                                :fileList="videoFileList"
                                refUpLoad="videoUpload"
                                listType="picture"></UpLoad>
                        <div class="el-upload__tip"><span v-if="showUpAndAdd"
                                                          style="color:#ff4d51;">如果想修改视频请先删除当前视频</span>如果在文章中想添加视频，请复制此处的视频地址→{{getNewVideoUrl}}
                        </div>
                    </el-form-item>
                    <el-form-item label="文章内容" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]" prop="content">
                        <!--富文本-->
                        <!-- 文件上传input 将它隐藏-->
                        <UpLoad
                                v-show="false"
                                :onUpLoadSuccess="newEditorSuccess"
                                :onUpLoadError="onUpLoadError"
                                :multiple="false"
                                :showFileList="false"
                                :drag="false"
                                accept="image/*"
                                :fileList="videoImgList"
                                refUpLoad="uniqueId"
                                idName="uniqueId"
                                :filesNumber="999"
                                :isClear="true"
                                listType="picture"></UpLoad>
                        <quill-editor ref="newEditor" v-model="form.content"
                                      :options="editorOption"></quill-editor>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import UpLoad from '../../common/Upload.vue';

    //将渲染的内容导出
    export default{
//        name: 'DiscoveryArticle',
        props: {},
        inject: ['reload'],
        data(){
            return {
                id: 0,//文章ID
                form: {
                    type: 'journalism',
                    way: 'leftrightrank',
                    description: '',
                    title: '',
                    thumbnail: '',
                    video: '',
                    videoImg: '',
                    content: '',//富文本数据
                },//表单数据
                stickCheckBox: false,
                videoUrl: '',//视频地址
                showUpAndAdd: false,//用来区分修改或者添加
                videoImgList: [],//上传视频封面图片的数据数组
                fileList: [],//上传图片的数据数组
                videoFileList: [],//上传视频的数据数组
                editorOption: {//富文本参数
                    placeholder: '开始编辑...'
                }
            }
        },
        methods: {
            videoImgSuccess(response){//视频封面上传后
                this.$message.success('上传成功！');
                this.$set(this.form, 'videoImg', response);
            },
            videoImgBeforeUpLoad(file){//视频封面图片
                const vm = this;
                return new Promise((resolve, reject) => {
                    if (!vm.form.video) {
                        vm.$confirm('未上传视频，是否继续上传视频缩略图?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            resolve(true);
                        }).catch(() => {
                            vm.videoImgList = [];
                            vm.$message({
                                type: 'info',
                                message: '上传视频缩略图已取消'
                            });
                            reject(false);
                        });
                    }
                });

            },
            videoSuccess(response, file, fileList){//上传视频接口回调
                this.$message.success('上传成功！');
                if (Object.is(this.form.type, "curriculum")) {
                    this.$set(this.form, 'video', response);
                }
                this.videoUrl = response;
            },
            videoBeforeUpLoad(){//视频上传前
                const vm = this;
                return new Promise((resolve, reject) => {
                    if (vm.form.type != 'curriculum') {
                        vm.$confirm('文章类型为文本类型，是否继续上传视频, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            resolve(true);
                        }).catch(() => {
                            vm.videoFileList = [];
                            vm.$message({
                                type: 'info',
                                message: '上传视频已取消'
                            });
                            reject(false);
                        });
                    }
                });
            },
            thumbnailSuccess(response){//上传缩略图回调方法
                this.$message.success('上传成功！');
                this.$set(this.form, 'thumbnail', response);

            },
            onUpLoadError(err){
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            getData(){//请求数据
                this.$axios({
                    url: '/discover/queryDiscover',
                    method: 'POST',
                    data: {
                        id: this.id
                    }
                }).then(res => {
                    if (res.success) {
                        //获取表单数据
                        this.form = res.data;
                        //截取URL
                        let thumbnailName = res.data.thumbnail ? res.data.thumbnail.split('/') : "";
                        let videoImgName = res.data.videoImg ? res.data.videoImg.split('/') : '';
                        if (!!thumbnailName) {//非空判断
                            //获取缩略图地址对象数组
                            this.$set(this.fileList, 0, {
                                name: !!thumbnailName ? thumbnailName[thumbnailName.length - 1] : '',
                                url: res.data.thumbnail
                            });
                            this.form.thumbnail = res.data.thumbnail
                        }
                        if (!!videoImgName) {
                            this.$set(this.videoImgList, 0, {
                                name: !!videoImgName ? videoImgName[videoImgName.length - 1] : '',
                                url: res.data.videoImg
                            });
                            this.form.videoImg = res.data.videoImg
                        }
                        if (!!res.data.video) {
                            this.videoUrl = res.data.video;
                            //获取视频地址对象数组
                            this.$set(this.videoFileList, 0, {
                                name: res.data.video,
                                url: res.data.video
                            })
                        }
                        //获取富文本数据
                        res.data.content =res.data.content.replace(/video/g,'iframe').replace(/controls="controls" webkit-playsinline="true" controlslist="nodownload" style=""/g,'class="ql-video"');
                        this.form.content = res.data.content;
                        this.stickCheckBox = Object.is(res.data.stick, 'yes');
                        this.$nextTick(function () {//解决富文本自动获取焦点并设置滚动条问题
                            this.$refs.newEditor.quill.enable(true);
                            this.$refs.newEditor.quill.blur();
                        });
                    }
                })
            },
            formatForm({id, title, thumbnail, video, stick, content, way, videoImg, type, description}){//格式化表单数据
                let obj = {};
                !!id ? obj['id'] = id : '';
                !!title ? obj['title'] = title : '';
                !!thumbnail ? obj['thumbnail'] = thumbnail : '';
                !!video ? obj['video'] = video : '';
                if (!!content) {
                    obj['content'] = "<div style='text-align: left;text-indent: 3px;'>" + content + "</div>";
                    //处理视频iframe
                    obj['content'] =obj['content'].replace(/iframe/g,'video').replace(/class="ql-video"/g,'controls="controls" webkit-playsinline="true" controlslist="nodownload" style=""');
                }
                !!way ? obj['way'] = way : '';
                !!videoImg ? obj['videoImg'] = videoImg : '';
                if (!!type) {
                    obj['type'] = type
                }
                !!stick ? obj['stick'] = stick : '';
                !!description ? obj['description'] = description : '';
                return obj;
            },
            onSubmit(){//提交代码
                this.$refs.Article.validate((valid) => {
                    if (valid) {
                        this.$set(this.form, 'stick', this.stickCheckBox ? 'yes' : 'no');
                        this.$set(this.form, 'id', this.id);
                        //格式化请求参数
                        let obj = this.formatForm(this.form);
                        if (!obj)return;
                        if (this.id) {
                            this.$axios({
                                url: '/discover/updateDiscover',
                                method: 'POST',
                                data: obj
                            }).then(res => {
                                if (res.success) {
                                    this.$message.success(res.data);
                                    this.getData();
                                }
                            })
                        } else {
                            this.$axios({
                                url: '/discover/insertDiscover',
                                method: 'POST',
                                data: obj
                            }).then(res => {
                                if (res.success) {
                                    this.$message.success(res.data);
                                    this.reload();
                                }
                            })
                        }
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });

            },
            //上传图片回调
            newEditorSuccess(response){
                this.$message.success('上传成功！');
                this.addImgRange = this.$refs.newEditor.quill.getSelection();
                this.$refs.newEditor.quill.insertEmbed(this.addImgRange != null ? this.addImgRange.index : 0, 'image', response)
                // 调整光标到最后
                this.$refs.newEditor.quill.setSelection(this.addImgRange.index + 1);

            }
        },
        components: {
            quillEditor,
            UpLoad
        },
        computed: {
            getNewTime(){//获取当前时间
                let date = new Date();
                let y = date.getFullYear();
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                return `${y}-${M}-${d} ${h}:${m}`;
            },
            getNewTitle(){//初始化标题
                return !this.form.title ? '一级标题一级标题一级标题' : this.form.title;
            },
            getNewVideoUrl(){//初始化视频地址显示
                return !this.videoUrl ? '无视频' : this.videoUrl;
            }
        },
        watch: {},
        created(){
            if (Object.keys(this.$route.query).length) {//获取传入的ID
                this.showUpAndAdd = true;//当传参进入时改变状态为编辑状态
                this.id = this.$route.query.id;
                this.getData();
            }
        },
        mounted(){
            //解决富文本自动获取焦点并设置滚动条问题
            this.$refs.newEditor.quill.enable(false);

            let imgHandler = async function (state) {//异步触发element ui的上传图片按钮
                if (state) {
                    let fileInput = document.querySelector('#uniqueId input'); //隐藏的file元素
                    fileInput.click(); //触发事件
                }
            }
            this.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)//将点击事件绑定到工具栏上的图片上传按钮上
            if (!this.id) {
                this.$nextTick(function () {//解决富文本自动获取焦点并设置滚动条问题
                    this.$refs.newEditor.quill.enable(true);
                    this.$refs.newEditor.quill.blur();
                });
            }
        },
    }
</script>

<style scoped>
    /**渲染内容的样式**/

    .phone {
        width: 225px;
        height: 487px;
        border: 1px solid #333333;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
    }

    .phone .phone-content {
        margin: 5px auto;
        width: 95%;
        height: 446px;
        overflow-y: auto;

    }

    .phone .phone-content >>> div {
        overflow-x: hidden;
    }

    .phone .phone-content >>> img {
        width: 100%;
    }

    .phone .phone-content .title {
        font-size: 14px;
    }

    .phone .phone-content .info {
        font-size: 12px;
        color: #c6c6c6;
    }

    .phone .phone-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #333333;
        height: 35px;
    }

    .phone .phone-btn .btn {
        margin: 2px auto;
        width: 30px;
        height: 30px;
        border: 1px solid #333333;
        border-radius: 50%
    }
</style>