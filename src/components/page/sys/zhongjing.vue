<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">关于中竞</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="infoform" :model="form" label-width="50px">
				<el-form-item label="文章内容" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]" prop="content">
					<!--富文本-->
					<!-- 文件上传input 将它隐藏-->

					<upload v-show="false" :onUpLoadSuccess="newEditorSuccess" :onUpLoadError="onUpLoadError" :multiple="false"
					 :showFileList="false" :drag="false" accept="image/*" :fileList="editorsList" refUpLoad="uniqueId" idName="uniqueId"
					 :filesNumber="999" :isClear="true" listType="picture"></upload>
					 
					 <upload class="videoUpload" v-show="false" :onUpLoadSuccess="newEditorVideoSuccess" :onUpLoadError="onUpLoadError" :multiple="false"
					  :showFileList="false" :drag="false" accept="video/*" :fileList="editorsVideoList" refUpLoad="uniqueId" idName="uniqueId"
					  :filesNumber="999" :isClear="true"></upload>
					<quill-editor ref="newEditor" v-model="form.content" class="container"></quill-editor>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdits('form')">保存</el-button>
			</span>
		</div>
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
		name: 'infomation',
		components: {
			quillEditor,
			upload
		},
		data() {
			return {
				editorsList: [],
				editorsVideoList:[],
				fileList: [],

				Sort: 0,

				editorOption: { //富文本参数
					placeholder: '开始编辑...'
				},

				imagedatelist: [],

				loading: true,

				selectTimeData: [],

				addInfoVisible: false,

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
				//辅助输入框模糊查询
				infoName: '',
				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,
				addImgRange:"",
				addVideoRange:'',
			};
		},

		created() {
			this.getData();
			this.init();
		},
		
		
		
		computed: {
			data() {
				return this.tableData;
			},
			total() {
				return this.count;
			}
		},
		methods: {
			init() {
				this.$nextTick(() => {
					let imgHandler = async function(state) {
						//异步触发element ui的上传图片按钮
						if (state) {
							let fileInput = document.querySelector("#uniqueId input"); //隐藏的file元素
							fileInput.click(); //触发事件
						}
					};
					this.$refs.newEditor.quill
						.getModule("toolbar")
						.addHandler("image", imgHandler); //将点击事件绑定到工具栏上的图片上传按钮上
						
						
					let videoHandler = async function(state) {
						//异步触发element ui的上传图片按钮
						if (state) {
							let fileInput = document.querySelector(".videoUpload #uniqueId input"); //隐藏的file元素
							fileInput.click(); //触发事件
						}
					};
					this.$refs.newEditor.quill
						.getModule("toolbar")
						.addHandler("video", videoHandler);
				});
			},
			//富文本专用上传图片回调
			newEditorSuccess(response, file) {
				this.$message.success("上传成功！");
				this.addImgRange = this.$refs.newEditor.quill.getSelection();
				//添加图片
				this.$refs.newEditor.quill.insertEmbed(
					this.addImgRange != null ? this.addImgRange.index : 0,
					"image",
					response
				);
				// 调整光标到最后
				this.$refs.newEditor.quill.setSelection(this.addImgRange.index + 1);
			},
			
			newEditorVideoSuccess(response, file) {
				this.$message.success("上传成功！");
				this.addVideoRange = this.$refs.newEditor.quill.getSelection();
				//添加图片
				this.$refs.newEditor.quill.insertEmbed(
					this.addVideoRange != null ? this.addVideoRange.index : 0,
					"video",
					response
				);
				// 调整光标到最后
				this.$refs.newEditor.quill.setSelection(this.addVideoRange.index + 1);
			},

			handleDelete(index, row) {
				this.$axios.post(
					'/politics/delPoliticsById', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功')
						this.getData();
					}
				})
			},

			saveEdits() {
				this.loading = true;
				let subData = { ...this.form
				};
				//外层嵌套div
				subData.content =
					"<div style='text-align: left;text-indent: 3px;'>" +
					subData.content +
					"</div>";
				//处理视频iframe
				subData.content = subData.content
					.replace(/iframe/g, "video")
					.replace(
						/class="ql-video"/g,
						'controls="controls" width="100%" style="margin: 10px auto;"'
					);
				//处理图片格式
				subData.content = subData.content.replace(
					/<img/g,
					'<img style="width:100%;"'
				);

				this.$refs.infoform.validate(valid => {
					if (valid) {
						/* 添加 */
						this.form["id"] = this.tableData.id;
						this.$axios.post('/aboutWe/updateAboutById', this.form).then(res => {
							if (!res.success) {
								this.$message.success(res.errMsg);
								this.loading = false;
								return;
							}
							this.$message.success(`操作成功`);
							this.getData();
							this.form = {};
							this.loading = false;
						});
						this.loading = false;
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},

			// 获取 easy-mock 的模拟数据
			getData() {
				this.loading = true;
				this.$axios
					.post('/aboutWe/selectAll', {})
					.then(res => {
						this.tableData = res.data;
						this.form = res.data;
						this.totalCount = res.data.total;
						this.loading = false;
					});
				this.loading = false;
			},

			search() {
				this.getData();
			},

			/* 图片上传 */
			onUpLoadError() {
				this.$message.error('出现错误，请重新尝试');
			},
			imgsuccess1(url) {
				this.$message.success('图片上传成功');
				this.form.image = url;
			},
			imgRemove1() {
				this.$message.success('图片删除成功');
			},

			onUpLoadSuccess(urlArr) {
				console.log(urlArr);
				this.form.img = urlArr;
			},

			/**
			 * 上传失败后的回调
			 */
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

	.el-tag+.el-tag {
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
