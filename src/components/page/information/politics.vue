<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">政策解读</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="infoName" placeholder="资讯标题" class="handle-input mr10"></el-input>
				<el-date-picker :editable="false" v-model="selectTimeData" type="datetimerange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add" @click="addInfo">新增</el-button>
				<el-button type="success" icon="search" @click="reset">重置</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="multipleTable">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true"  prop="title" align="center" label="标题"></el-table-column>
				<el-table-column :show-overflow-tooltip="true"  prop="introduction" align="center" label="简介"></el-table-column>
				<el-table-column :show-overflow-tooltip="true"  prop="source" align="center" label="来源"></el-table-column>
				<el-table-column width="120" height="60" align="center" prop="image" label="封面图">
					<template slot-scope="scope">
						<el-popover placement="top-start" trigger="click">
							<!--trigger属性值：hover、click、focus 和 manual-->
							<a :href="scope.row.scope" target="_blank" title="查看最大化图片">
								<img :src="scope.row.image" style="min-width: 300px;height: 200px; cursor:pointer;">
							</a>
							<img slot="reference" :src="scope.row.image" style="min-width: 80px;height: 80px; cursor:pointer">
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" align="center" prop="label" label="标签"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true"  prop="createTime"
				 label="显示日期"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true"  prop="updateTime"
				 label="更新时间"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" align="center"  prop="sort" label="排列顺序"></el-table-column>
				<el-table-column  header-align="center" align="center" width="160" label="操作">
					<template slot-scope="scp">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scp.$index, scp.row)">查看详情(修改)</el-button>
						<el-popconfirm title="确认删除此资讯吗？" @onConfirm="handleDelete(scp.$index, scp.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51!important">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>

		<el-dialog @open="init" title="新增/编辑资讯" :visible.sync="addInfoVisible" :close-on-click-modal="closeOnClickModal">
			<el-form ref="infoform" :model="form" label-width="50px">
				<el-form-item label-width="100px" label="标题" prop="title" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="简介" prop="introduction" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.introduction"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="来源" prop="source" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.source"></el-input>
				</el-form-item>
				
				<el-form-item label-width="100px" label="显示日期" prop="createTime" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
				 <el-date-picker
				      v-model="form.createTime"
				      type="datetime"
				      placeholder="选择日期时间">
				    </el-date-picker>
				</el-form-item>

				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="封面图" prop="image" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess1" :onUpLoadRemove="imgRemove1"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="imagedatelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>

				<el-form-item label-width="100px" label="标签" prop="label" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.label"></el-input>
				</el-form-item>
				<span style="padding-left: 100px;">多个标签请用逗号隔开</span>
				<br />
				<el-form-item label="文章内容" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]" prop="content">
					<!--富文本-->
					<!-- 文件上传input 将它隐藏-->

					<upload v-show="false" :onUpLoadSuccess="newEditorSuccess" :onUpLoadError="onUpLoadError" :multiple="false"
					 :showFileList="false" :drag="false" accept="image/*" :fileList="editorsList" refUpLoad="uniqueId" idName="uniqueId"
					 :filesNumber="999" :isClear="true" listType="picture"></upload>
					<upload class="videoUpload" v-show="false" :onUpLoadSuccess="newEditorVideoSuccess" :onUpLoadError="onUpLoadError"
					 :multiple="false" :showFileList="false" :drag="false" accept="video/*" :fileList="editorsVideoList" refUpLoad="uniqueId"
					 idName="uniqueId" :filesNumber="999" :isClear="true"></upload>
					<quill-editor ref="newEditor" v-model="form.content" class="container"></quill-editor>
				</el-form-item>

				<el-form-item label-width="100px" label="排列顺序" prop="sort">
					<el-input v-model.number="Sort"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdits('form')">确
					定</el-button>
				<el-button @click="addInfoVisible = false">取 消</el-button>
			</span>
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
		name: 'infomation',
		components: {
			quillEditor,
			upload
		},
		data() {
			return {
				editorsList: [],
				editorsVideoList: [],
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
			};
		},
		watch: {
			Sort(vel, old) {
				this.form["Sort"] = vel;
			}
		},

		created() {
			this.getData();
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
						if (this.form.id == '' || this.form.id == null) {
							if (this.Sort == "" || this.Sort == null || this.Sort == 0) {
								this.Sort = 0;
							}

							this.form = {
								title: subData.title,
								introduction: subData.introduction,
								source: subData.source,
								createTime:subData.createTime,
								image: subData.image,
								label: subData.label,
								content: subData.content,
								status: subData.status,
								sort: this.Sort,
							};
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.$axios.post('/politics/addPolitics', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.form = {};
								this.loading = false;
								this.addInfoVisible = false;
							});
							this.loading = false;
						} else {
							/* 更新 */
							this.form = {
								id: subData.id,
								title: subData.title,
								introduction: subData.introduction,
								introduction: subData.introduction,
								createTime:subData.createTime,
								source: subData.source,
								image: subData.image,
								label: subData.label,
								content: subData.content,
								status: subData.status,
								sort: this.Sort,
							};
							this.loading = true;
							let fd = JSON.parse(JSON.stringify(this.form));
							this.$axios.post('/politics/updatePoliticsById', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getData();
								this.addInfoVisible = false;
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
				this.form = row;
				this.Sort = row.sort;
				this.form["Sort"] = this.Sort;
				this.idx = index;
				this.imagedatelist = [];
				this.imagedatelist.push({
					name: row.image,
					url: row.image
				});

				row.content = row.content
					.replace(/video/g, "iframe")
					.replace(
						/controls="controls" width="100%" style="margin: 10px auto;"/g,
						'class="ql-video"'
					);
				this.$nextTick(function() {
					//解决富文本自动获取焦点并设置滚动条问题
					this.$refs.newEditor.quill.enable(true);
					this.$refs.newEditor.quill.blur();
				});
				this.addInfoVisible = true;
			},

			formatRowData(row, column) {
				var returnData;
				switch (column.property) {
					case "createTime":
						returnData = new Date(row.createTime).format("yyyy-MM-dd");
						break;
					case "updateTime":
						returnData = new Date(row.updateTime).format("yyyy-MM-dd");
						break;
				}
				return returnData;
			},

			formatUpdateTime(row) {
				return new Date(row.updateTime).format("yyyy-MM-dd");
			},

			addInfo() {
				this.Sort = 0;
				this.form = {};
				this.Sort = "",
					this.imagedatelist = [];
				this.addInfoVisible = true;
			},

			// 获取 easy-mock 的模拟数据
			getData() {
				this.loading = true;
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				var startTime = null;
				var endTime = null;
				if (this.selectTimeData== [] || this.selectTimeData == null || this.selectTimeData == "") {} else {
					startTime = new Date(this.selectTimeData[0]).format("yyyy/MM/dd");
					endTime = new Date(this.selectTimeData[1]).format("yyyy/MM/dd");
				}
				this.$axios
					.post('/politics/selectPolitics', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						title: this.infoName,
						startTime: startTime,
						endTime: endTime,
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
						this.loading = false;
					});
				this.loading = false;
			},

			search() {
				this.currentPage = 1;
				this.getData();
			},

			reset() {
				this.selectTimeData = [];
				this.infoName = "";
				this.search();
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
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
