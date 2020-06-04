<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">项目列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="pjcName" placeholder="项目名称" class="handle-input mr10"></el-input>
				<el-date-picker :editable="false" v-model="selectTimeData" type="datetimerange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<template>
					<el-select filterable v-model="userInfoId" placeholder="请选择客户">
						<el-option v-for="item in userInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
					</el-select>
				</template>
				<template>
					<el-select filterable v-model="staffInfoId" placeholder="请选择员工">
						<el-option v-for="item in staffInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
					</el-select>
				</template>
				<template>
					<el-select v-model="status" placeholder="请选择状态">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.ename"></el-option>
					</el-select>
				</template>

				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add" @click="addPjc">新增</el-button>
				<el-button type="primary" icon="search" @click="reset">重置</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table max-height="645px" :data="tableData" border class="table" ref="multipleTable">
				<el-table-column :show-overflow-tooltip="true" label="编号" prop="id" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="projectName" align="center" label="项目名称"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="userId" align="center"
				 label="客户"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="staffId" align="center"
				 label="员工"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="percentage" align="center"
				 label="项目进度百分比"></el-table-column>
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
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="accomplishStatus" align="center"
				 label="完成状态"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" align="center" width="140" prop="predictEndTime"
				 label="预计结束时间"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true" width="180" prop="startTime"
				 label="开始时间"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true" width="180" prop="endTime"
				 label="结束时间"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="score" align="center"
				 label="是否已经评价分数"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="evaluateContent" align="center"
				 label="评价内容"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="180" prop="evaluateTime" align="center"
				 label="评价时间"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="evaluateScore" align="center"
				 label="评价分数"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="rental" align="center"
				 label="总额"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="paid" align="center"
				 label="已付金额"></el-table-column>
				<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="file" align="center"
				 label="附件路径"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true" width="140" prop="createTime"
				 label="创建时间"></el-table-column>
				<el-table-column :formatter="formatRowData" align="center" :show-overflow-tooltip="true" width="140" prop="updateTime"
				 label="修改时间"></el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
					<template slot-scope="scp">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scp.$index, scp.row)">修改项目</el-button>
						<el-button type="text" icon="el-icon-edit" @click="gotoProInfo(scp.$index, scp.row)">查看项目详情</el-button>
						<el-button type="text" icon="el-icon-download" @click="downloadFile(scp.$index, scp.row)">下载附件</el-button>

						<el-popconfirm title="确认删除此项目吗？" @onConfirm="handleDelete(scp.$index, scp.row)">
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

		<!-- 编辑项目弹出框 -->
		<el-dialog title="新增/编辑项目" :visible.sync="editProjectVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="projectform" :model="form" label-width="50px">
				<el-form-item label-width="100px" label="项目名称" prop="projectName" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<el-input v-model="form.projectName"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="用户" prop="userId" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select filterable v-model="form.userId" placeholder="请选择客户">
							<el-option v-for="item in userInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item label-width="120px" label="员工" prop="staffId" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select filterable v-model="form.staffId" placeholder="请选择员工">
							<el-option v-for="item in staffInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-form-item>


				<el-form-item label-width="120px" label="开始时间" prop="startTime" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'}]">
					<div class="block">
						<el-date-picker v-model="form.startTime" align="right" type="date" placeholder="选择日期" format="yyyy/MM/dd">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label-width="120px" label="预计结束时间" prop="predictEndTime" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'}]">
					<div class="block">
						<el-date-picker v-model="form.predictEndTime" align="right" type="date" placeholder="选择日期" format="yyyy/MM/dd">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label-width="120px" label="结束时间" prop="endTime">
					<div class="block">
						<el-date-picker v-model="form.endTime" align="right" type="date" placeholder="选择日期" format="yyyy/MM/dd">
						</el-date-picker>
					</div>
				</el-form-item>


				<el-form-item label-width="120px" label="完成状态" prop="accomplishStatus" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'}]">
					<template>
						<el-select v-model="form.accomplishStatus" placeholder="请选择状态">
							<el-option v-for="item in statusOptions1" :key="item.id" :label="item.name" :value="item.ename"></el-option>
						</el-select>
					</template>
				</el-form-item>

				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="项目缩略图" prop="image">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess1" :onUpLoadRemove="imgRemove1"
						 :onUpLoadError="onUpLoadError" :multiple="false" :drag="true" :show-file-list="true" accept="image/*" :fileList="imagedatelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>

				<el-form-item label-width="100px" label="总额" prop="rental" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.rental"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="已付金额" prop="paid" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.paid"></el-input>
				</el-form-item>

				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="附件" prop="file">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="filesuccess" :onUpLoadRemove="fileRemove"
						 :onUpLoadError="onUpLoadError" :multiple="false" :drag="true" :show-file-list="true" accept="*" :fileList="filedatelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>

				<el-form-item label-width="100px" label="完成百分比 默认为0" prop="percentage">
					<template>
						<div class="block">
							<el-slider v-model="form.percentage" show-input>
							</el-slider>
						</div>
					</template>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveProjectEdit('form')">确
					定</el-button>
				<el-button @click="editProjectVisible = false">取 消</el-button>
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
				status: null,
				statusOptions: [{
						id: 0,
						name: "全部",
						ename: null
					},
					{
						id: 1,
						name: "进行中",
						ename: "having"
					},
					{
						id: 2,
						name: "已结束",
						ename: "finished"
					}
				],
				statusOptions1: [{
						id: 1,
						name: "进行中",
						ename: "having"
					},
					{
						id: 2,
						name: "已结束",
						ename: "finished"
					}
				],

				userInfoId: "",
				staffInfoId: "",

				pjcName: "",

				userInfo: [],

				staffInfo: [],

				editorOption: { //富文本参数
					placeholder: '开始编辑...'
				},

				imagedatelist: [],

				filedatelist: [],

				loading: true,

				selectTimeData: [],
				editProjectVisible: false,

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
				subData:{},
				
				imgx:'',
				filex:'',
			};
		},

		created() {
			this.getData();
			this.getUserInfo();
			this.getStaffInfo();
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
			gotoProInfo(index, row) {
				this.$router.push({
					name: 'proinfo'
				});

			},


			downloadFile(index, row) {
				if (row.file == "" || row.file == null|| row.file == "无") {
					this.$message.error("所选项目未上传附件");
				} else {
					//window.location.href = row.file;
					window.open(row.file, "_blank")
				}

			},

			getUserInfo() {
				this.$axios.post(
					'/backUser/queryUserSelect', {}
				).then(res => {
					if (!res.success) {
						this.$message.error("获取用户信息失败");
						return;
					}
					this.userInfo = res.data;
				})
			},

			getStaffInfo() {
				this.$axios.post(
					'/staff/queryStuffSelect', {}
				).then(res => {
					if (!res.success) {
						this.$message.error("获取施工人员信息失败")
						return;
					}
					this.staffInfo = res.data;
				})
			},

			handleDelete(index, row) {
				this.$axios.post(
					'/project/delProjectById', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功')
						this.getData();
					}
				})
			},

			saveProjectEdit() {
				this.loading = true;
				this.$refs.projectform.validate(valid => {
					if (valid) {
						/* 添加 */
						this.subData = this.form;
						this.subData.image = this.imgx;
						this.subData.file = this.filex;
						this.subData.startTime = new Date(this.form.startTime).format("yyyy/MM/dd hh:mm:ss");
						if(this.subData.endTime==null||this.subData.endTime==""||this.subData.endTime==[]){}else{
							this.subData.endTime = new Date(this.form.endTime).format("yyyy/MM/dd hh:mm:ss");
						}
						
						this.subData.predictEndTime = new Date(this.form.predictEndTime).format("yyyy/MM/dd hh:mm:ss");
						if (this.form.id == '' || this.form.id == null) {
							if(this.imgx==""||this.imgx==null||this.imgx==[]){
								this.$message.error("请添加缩略图");
								this.loading = false;
								return;
							}
							let fd = JSON.parse(JSON.stringify(this.subData));
							delete fd.id;
							this.$axios.post('/project/addProject', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.form = {};
								this.loading = false;
								this.editProjectVisible = false;
							});
							this.loading = false;
						} else {
							/* 更新 */
							this.loading = true;
							let fd = JSON.parse(JSON.stringify(this.subData));
							this.$axios.post('/project/updateProjectById', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getData();
								this.loading = false;
								this.editProjectVisible = false;
							});
							this.loading = false;
						}
					} else {
						console.error('error submit!!');
						this.$message.error("参数填写不完全");
						this.loading = false;
						return false;
					}
				});
			},
			handleEdit(index, row) {
				this.form = row;
				this.idx = index;
				this.imagedatelist = [];
				this.filedatelist = [];
				this.imgx = "";
				if(row.file == ""||row.file == null || row.file == "无"){
					
				}else{
					this.filedatelist.push({
						name: row.file,
						url: row.file
					});
				}
				this.imagedatelist.push({
					name: row.image,
					url: row.image
				});
				this.editProjectVisible = true;
			},

			formatRowData(row, column) {
				var returnData;
				switch (column.property) {
					case "createTime":
						returnData = new Date(row.createTime).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "updateTime":
						returnData = new Date(row.updateTime).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "startTime":
						returnData = new Date(row.startTime).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "endTime":
						row.endTime < new Date(1577808000) ? returnData = "项目暂未结束" : returnData = new Date(row.endTime).format(
							"yyyy/MM/dd hh:mm:ss");
						break;
					case "predictEndTime":
						returnData = new Date(row.predictEndTime).format("yyyy/MM/dd");
						break;
					case "accomplishStatus":
						switch (row.accomplishStatus) {
							case "notStart":
								returnData = "未开始";
								break;
							case "having":
								returnData = "进行中";
								break;
							case "finished":
								returnData = "已完成";
								break;
						}
						break;
					case "percentage":
						returnData = row.percentage + "%";
						break;
					case "evaluateContent":
						row.evaluateWithContext == "" || row.evaluateWithContext == null ? returnData = "尚未评价" : returnData = row.evaluateContent;
						break;
					case "evaluateTime":
						row.evaluateTime < new Date(1577808000) ? returnData = "尚未评价" : returnData = new Date(row.evaluateTime).format(
							"yyyy/MM/dd hh:mm:ss");
						break;
					case "evaluateScore":
						row.evaluateScore == "" || row.evaluateScore == null ? returnData = "暂未评分" : returnData = row.evaluateScore;
						break;
					case "score":
						row.score == "yes" ? returnData = "已评分" : returnData = "未评分";
						break;
					case "rental":
						returnData = "￥" + row.rental;
						break;
					case "paid":
						returnData = "￥" + row.paid;
						break;
					case "userId":
						this.userInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.userId == username) {
								returnData = item.name;
							}
						});
						break;
					case "staffId":
						this.staffInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.staffId == username) {
								returnData = item.name;
							}
						});
						break;


					case "file":
						row.file == "" || row.file == null || row.file == "无" ? returnData = "暂未上传附件" : returnData = row.file;
				}
				return returnData;
			},

			addPjc() {
				this.form = {};
				this.imagedatelist = [];
				this.filedatelist = [];
				this.imgx = "";
				this.editProjectVisible = true;
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

				this.pjcName == "" ? this.pjcName = null : this.pjcName = this.pjcName;
				this.userInfoId == "" ? this.userInfoId = null : this.userInfoId = this.userInfoId;
				this.staffInfoId == "" ? this.staffInfoId = null : this.staffInfoId = this.staffInfoId;
				this.$axios
					.post('/project/selectProject', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						accomplishStatus: this.status,
						projectName: this.pjcName,
						userId: this.userInfoId,
						staffId: this.staffInfoId,
						startTime: startTime,
						endTime: endTime,
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
				this.loading = false;
			},

			search() {
				this.getData();
			},

			reset() {
				this.selectTimeData = [];
				this.pjcName = "";
				this.userInfoId = "";
				this.staffInfoId = "";
				this.status = null;
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
				this.imgx = url;
			},
			filesuccess(url) {
				this.$message.success("文件上传成功");
				this.filex = url;
			},

			imgRemove1() {
				this.$message.success('图片删除成功');
				this.imgx = "";
			},
			fileRemove() {
				this.$message.success('文件删除成功');
				this.subData.file = "无";
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
