<template>
    <!--在此处添加渲染的内容-->
    <div>
        <el-upload
                :id="idName"
                :ref="refUpLoad"
                :drag="drag"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :on-remove="onUpLoadRemove"
                :on-preview="onUpLoadPreView"
                :http-request="handleHttpRequest"
                :headers="uploadHeaders"
                :limit="filesNumber"
                :list-type="listType"
                :disabled="disabled"
                :multiple="multiple"
                :show-file-list="showFileList"
                action=""
                :accept="accept"
                :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div v-if="drag" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div v-if="drag" slot="tip" class="el-upload__tip">上传文件大小不能超过 10M</div>
        </el-upload>
    </div>
</template>

<script type="text/ecmascript-6">
    import Client from '../../utils/Client'
    //将渲染的内容导出
    export default{
        props: {
            multiple: {//是否可以多选
                type: Boolean,
                default: true
            },
            drag: {//是否可以拖拽上传
                type: Boolean,
                default: true
            },
            fileList: {//文件数组
                type: Array,
                required: true
            },
            onUpLoadSuccess: {//上传成功后的回调
                type: Function,
                required: true
            },
            onSuccess: {//组件原生的上传成功监听
                type: Function
            },
            onUpLoadBeforeUpload: {//上传前的回调
                type: Function,
                default: undefined
            },
            onUpLoadError: {//上传失败的回调
                type: Function,
                required: true
            },
            onUpLoadRemove: {//删除fileList文件的回调
                type: Function,
                default: () => {
                    (file, fileList) => {

                    }
                }
            },
            onUpLoadPreView: {//点击文件列表中已上传的文件时的钩子
                type: Function
            },
            refUpLoad: {//ref 名
                type: String,
                default: 'upload'
            },
            listType: {//上传组件 文件列表的类型
                type: String,
                default: 'picture'
            },
            filesNumber: {//可上传文件数
                type: Number,
                default: 1
            },
            showFileList: {//是否显示已上传文件列表
                type: Boolean,
                default: true
            },
            idName: {//上传组件的ID
                type: String,
                required: true
            },
            accept: {//接受上传的文件类型
                type: String,
                default: ''
            },
            randomName: {//上传时是否使用随机命名  六位的英文大小写加数字随机摆列_时间戳.后缀名的方式命名
                type: Boolean,
                default: true
            },
            isClear: {//上传完毕后 是否清空
                type: Boolean,
                default: false
            },
            isHeaders: {//上传时是否携带指定的Headers
                type: Boolean,
                default: false
            },
            videoType: {
                type: String
            }
        },


        data(){
            return {
                region: 'oss-cn-beijing',
                bucket: 'zjtc-bucket-01',
                percentage: 0,
                url: '/sequence/getStsOss',
                ClientObj: null,
                dataObj: {},
                expiration: '',
                uploadHeaders: {
                    authorization: '*'
                },
                disabled: false,
                headers: {'Content-Type': 'application/x-zip-compressed'},
            }
        },
        methods: {
            getAliToken(){ //获取Token
                return new Promise((resolve, reject) => {
                    this.$axios({
                        method: 'POST',
                        url: this.url
                    }).then(res => {
                        if (res.success) {
                            const {expiration, tempAk, tempSk, token} = res.data;
                            this.expiration = expiration;
                            this.dataObj = {
                                region: this.region,
                                bucket: this.bucket,
                                accessKeyId: tempAk,
                                accessKeySecret: tempSk,
                                stsToken: token
                            };
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(false);
                    })
                })
            },
            async beforeUpload(file){
                //获取请求ali的Token
                const promise = new Promise((resolve, reject) => {
                    this.getAliToken().then(response => {
                        if (response) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                    }).catch(err => {
                        console.error(err);
                        reject(err);
                    });
                });
                //判断是否有上传前需要做得事情
                if(this.onUpLoadBeforeUpload!=null&&(this.videoType=='journalism'||this.videoType=='questions')) {

                    //阻塞方法
                    const result = await this.onUpLoadBeforeUpload();
                    if(result){
                        return promise;
                    }else {
                        this.$refs[this.refUpLoad].abort(file);
                    }
                }else {
                    return promise;
                }
            },
            handleHttpRequest(option){ //上传OSS
                try {
                    let vm = this;
                    vm.disabled = true;
                    const client = Client(this.dataObj), file = option.file, relativePath = 'https://zjtc-bucket-01.oss-cn-beijing.aliyuncs.com/';
                    //随机命名
                    const random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop();
                    // 分片上传文件
                    client.multipartUpload(vm.randomName ? random_name : file.name, file, {
                        headers: vm.isHeaders ? vm.headers : null,
                        progress: async function (p) {
                            option.file.percent = p * 100;
                            option.onProgress(option.file)
                        }
                    }).then(({res}) => {
                        if (res.statusCode === 200) {
                            vm.disabled = false;
                            //根据?截取前半部分地址
                            let url = res.requestUrls[0].split('?');
                            url = "https"+url[0].substring(4);
                            //上传成功事件回调
                            option.onSuccess(url, file);
                            //回调函数
                            vm.onUpLoadSuccess(url, file);
                            //判断是否清空上传组件类的数据
                            if(vm.isClear){
                                this.$refs[this.refUpLoad].clearFiles();
                            }
                        } else {
                            vm.disabled = false;
                            option.onError('上传失败');
                            this.onUpLoadError(error);
                        }
                    }).catch(error => {
                        vm.disabled = false;
                        this.onUpLoadError(error);
                    });

                } catch (error) {
                    this.disabled = false;
                    option.onError('上传失败');
                    this.onUpLoadError(error);
                }
            },
            // 随机生成文件名
            random_string(len) {
                len = len || 32;
                let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678', maxPos = chars.length, pwd = 'wxapp/';
                for (let i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }
        },
        watch: {
            url(val){
                if (val) {
                    this.urls.push(val);
                }
            }
        },
        components: {},
        computed: {},
        watch: {},
        created(){
        },
        mounted(){
        },

    }
</script>

<style scoped>
	
    /**渲染内容的样式**/
</style>
