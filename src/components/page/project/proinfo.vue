<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">项目详情</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-card class="box-card" style="width: 100%;">
				<div slot="header" class="clearfix">

					<template>
						<span>项目状态: </span>
						<el-select v-model="status" placeholder="请选择状态">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.ename"></el-option>
						</el-select>
					</template>

					<template>
						<span>&nbsp;&nbsp;&nbsp;&nbsp; 选择项目:&nbsp;&nbsp;&nbsp;</span>
						<el-select filterable v-model="pjcId" placeholder="请选择项目" style="width: 300px;">
							<el-option v-for="item in pjcInfo" :key="item.id" :label="'id:'+item.id+' 项目名称:'+item.projectName" :value="item.id"></el-option>
						</el-select>
					</template>
				</div>
				<div class="block">
					<div v-if="tableData!=null&&tableData!=''" style="height:500px;overflow:auto;">
						<el-timeline>
							<el-timeline-item v-for="(item,index) in tableData" :key = "index" :color="item.color" :timestamp="item.date | formatDate" placement="top">
								<el-card>
									<h4>{{item.title}}({{item.completionStatus | formatCompletionStatus}})</h4>
									<p>负责人:{{item.staffName}} &nbsp;&nbsp;{{item.staffPhone}} &nbsp;&nbsp;&nbsp;&nbsp; 负责内容:{{item.content}}</p>

									<br />
									<span>备注:</span>
									<span v-if="item.remark!=null&&item.remark!=''">{{item.remark}}</span>
									<span v-else>无</span>
								</el-card>
							</el-timeline-item>
						</el-timeline>
					</div>
					<div v-else-if="pjcId==null||pjcId==''">
						<h4>暂无数据,请选择项目</h4>
					</div>
					<div v-else>
						<h4>本项目暂无数据</h4>
					</div>
				</div>
			</el-card>
			<el-card class="box-card" style="width: 100%;">
				<div class="crumbs">
					<el-breadcrumb separator="/">
						<el-breadcrumb-item><i class="el-icon-lx-cascades">项目详情</i></el-breadcrumb-item>
					</el-breadcrumb>
				</div>


				<div class="container">
					<div class="handle-box">
						<!-- <el-input v-model="pjcName" placeholder="项目名称" class="handle-input mr10"></el-input>
						<template>
							<el-select filterable v-model="staffInfoId" placeholder="请选择员工">
								<el-option v-for="item in staffInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
							</el-select>
						</template>
						<template>
							<el-select v-model="infoStatus" placeholder="请选择状态">
								<el-option v-for="item in infoStatusOptions" :key="item.id" :label="item.name" :value="item.ename"></el-option>
							</el-select>
						</template> -->

						<el-button v-if="pjcId!=null&&pjcId!=''" type="primary" icon="add" @click="addInfo">新增项目流程</el-button>
					</div>
					<!-- 信息展示 -->
					<el-table max-height="600px" :data="tableData" border class="table" ref="multipleTable">
						<el-table-column :show-overflow-tooltip="true" label="编号" prop="id" align="center" sortable width="50"></el-table-column>
						<el-table-column sortable :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="date" align="center"
						 label="日期"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="140" prop="title" align="center" label="标题"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="staffId" align="center"
						 label="负责人"></el-table-column>
						<el-table-column :formatter="formatRowData" sortable :show-overflow-tooltip="true" width="140" prop="completionStatus"
						 align="center" label="完成状态"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" width="140" prop="content" align="center" label="内容"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="remark" align="center"
						 label="备注"></el-table-column>
						<el-table-column width="120" height="60" align="center" pro0o-pp="image" label="封面图">
							<template slot-scope="scope">
								<el-popover placement="top-start" trigger="click">
									<!--trigger属性值：hover、click、focus 和 manual-->
									<a :href="scope.row.scope" target="_blank" title="查看最大化图片">
										<img :src="scope.row.image" style="min-width: 300px;width: 200px; height: 200px; cursor:pointer;">
									</a>
									<img slot="reference" :src="scope.row.image" style="min-width: 80px;height: 80px; cursor:pointer">
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="createTime" align="center"
						 label="创建时间"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="updateTime" align="center"
						 label="修改时间"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="createUserId" align="center"
						 label="创建人"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" width="140" prop="updateUserId" align="center"
						 label="修改人"></el-table-column>


						<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
							<template slot-scope="scp">
								<el-button type="text" icon="el-icon-edit" @click="handleEdit(scp.$index, scp.row)">修改项目流程</el-button>
								<el-button type="text" icon="el-icon-bottom" @click="handleAdd(scp.$index, scp.row)">向下插入项目流程</el-button>
								<el-button type="text" icon="el-icon-edit" @click="handleEditImg(scp.$index, scp.row)">查看/修改项目流程图片</el-button>
								<el-popconfirm title="确认删除此项目流程吗？" @onConfirm="handleDelete(scp.$index, scp.row)">
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
			</el-card>
		</div>


		<!-- 添加/编辑项目流程 -->
		<el-dialog title="新增/编辑项目流程" :visible.sync="editPjcInfoVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="pjcInfoform" :model="form" label-width="50px">
				<el-form-item label-width="100px" label="标题" prop="title" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' },{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<el-input v-model="form.title"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="内容" prop="content" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' },{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<el-input v-model="form.content"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="备注" prop="remark">
					<el-input v-model="form.remark"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="流程日期" prop="date" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' },{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<div class="block">
							<el-date-picker :key="startDay" v-model="form.date" type="date" placeholder="选择流程日期" :picker-options="pickerOptions0">
							</el-date-picker>
						</div>
					</template>
				</el-form-item>

				<el-form-item label-width="120px" label="员工" prop="staffId" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select filterable v-model="form.staffId" placeholder="请选择员工">
							<el-option v-for="item in staffInfo" :key="item.id" :label="item.name+''+item.phone" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-form-item>

				<el-form-item label-width="120px" label="完成状态" prop="completionStatus" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select v-model="form.completionStatus" placeholder="请选择状态">
							<el-option v-for="item in infoStatusOptionss" :key="item.id" :label="item.name" :value="item.ename"></el-option>
						</el-select>
					</template>
				</el-form-item>

				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="项目缩略图" prop="image">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess1" :onUpLoadRemove="imgRemove1"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="imagedatelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>


			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveInfoEdit('form')">确
					定</el-button>
				<el-button @click="editPjcInfoVisible = false">取 消</el-button>
			</span>
		</el-dialog>



		<el-dialog title="新增图片" :visible.sync="infoimgVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="imgform" :model="form" label-width="50px">
				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="详细照片" prop="image">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess2" :onUpLoadRemove="imgRemove2"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="formimglist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveImg('form')">确
					定</el-button>
				<el-button @click="infoimgVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<!-- 多图 -->
		<el-dialog title="编辑项目流程图片" :visible.sync="imgVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<template>
				<el-carousel :interval="4000" type="card" height="200px">
					<el-carousel-item v-for="item in imagelist" :key="item.id">
						<el-image class="medium" style="height: 200px;width: 550px;" :src="item.image" :fit="item.image"></el-image>
					</el-carousel-item>
				</el-carousel>
			</template>

			<el-button v-if="pjcId!=null&&pjcId!=''" type="primary" icon="add" @click="addimg">新增详细照片</el-button>
			<el-table max-height="600px" :data="imagelist" border class="table" ref="multipleTable">
				<el-table-column :show-overflow-tooltip="true" label="编号" prop="id" align="center" sortable width="50"></el-table-column>
				<el-table-column width="120" height="60" align="center" pro0o-pp="image" label="详细照片">
					<template slot-scope="scope">
						<el-popover placement="top-start" trigger="click">
							<!--trigger属性值：hover、click、focus 和 manual-->
							<a :href="scope.row.scope" target="_blank" title="查看最大化图片">
								<img :src="scope.row.image" style="min-width: 300px;width: 200px; height: 200px; cursor:pointer;">
							</a>
							<img slot="reference" :src="scope.row.image" style="min-width: 80px;height: 80px; cursor:pointer">
						</el-popover>
					</template>
				</el-table-column>

				<el-table-column header-align="center" align="center" width="160" label="操作">
					<template slot-scope="scp">
						<el-popconfirm title="确认删除此图片吗？" @onConfirm="handleInfoImgDelete(scp.$index, scp.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51!important">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="imgVisible = false">确
					定</el-button>
				<el-button @click="imgVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script scopes>
	import menu from '../../common/menu';
	import upload from '../../common/Upload.vue';
	import arrUtil from '../../../utils/arrUtil.js';

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
				infoimgVisible: false,

				pickerOptions0: {
					disabledDate(time) {
						// 在科学计数法中，为了使公式简便，可以用带“E”的格式表示。例如1.03乘10的8次方，可简写为“1.03e8”的形式
						// 一天是24*60*60*1000 = 86400000 = 8.64e7
						return time.getTime() < new Date().startDay(new Date, "get") - 8.64e7;
					},
				},


				formimglist: [],
				imgVisible: false,

				imagelist: [],

				startDay: "",

				pjcId: "",


				editPjcInfoVisible: false,

				infoStatus: null,

				staffInfo: [],
				pjcInfo: "",
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

				infoStatusOptions: [{
						id: 0,
						name: "全部",
						ename: null
					},

					{
						id: 1,
						name: "未开始",
						ename: "notStart"
					},
					{
						id: 2,
						name: "进行中",
						ename: "having"
					},
					{
						id: 3,
						name: "已结束",
						ename: "finished"
					}
				],

				infoStatusOptionss: [{
						id: 0,
						name: "未开始",
						ename: "notStart"
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



				adminInfo: [],
				imagedatelist: [],
				loading: false,
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

				postinfoid: "",

				formImgListArr: "",
				imgx:"",
			};
		},

		filters: {
			formatDate: (value) => {
				if (!value) return ''
				return new Date(value).format("yyyy/MM/dd hh:mm:ss");
			},

			formatCompletionStatus: (value) => {
				if (!value) return ''
				switch (value) {
					case "notStart":
						return "未开始";
						break;
					case "having":
						return "进行中";
						break;
					case "finished":
						return "已完成";
						break;
				}
			},
		},

		watch: {
			status(vel) {
				this.getPjcInfo();
			},
			pjcId(vel) {
				this.getData();
			},
			startDay(vel) {
				this.reset();
			}
		},

		created() {
			this.getPjcInfo();
			this.getStaffInfo();
			this.getAdminInfo();
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
			handleInfoImgDelete(index, row) {
				this.$axios.post(
					'/projectInfoImg/delPictureById', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功')
						this.$axios.post(
							'/projectInfoImg/selectAllByInfoId', {
								infoId: this.postinfoid
							}
						).then(res => {
							if (res.success) {
								this.imagelist = res.data;
								this.formimglist = [];
							} else {
								this.$message.error("获取图片错误,请重试");
							}
						})
					}
				})
			},

			saveImg() {
				if(this.formImgListArr==""||this.formImgListArr==null){
					this.$message.error("请选择图片");
					return;
				}
				this.loading = true;
				
				const subData = this.form;
				
				subData["infoId"] = this.postinfoid;
				
				var alist = [];
				alist.push(this.formImgListArr);
				subData["image"] = alist;
				let fd = JSON.parse(JSON.stringify(subData));
				delete fd.id;
				this.$axios.post('/projectInfoImg/addPictureByInfoId', fd).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						this.loading = false;
						return;
					}
					this.$message.success(`添加成功`);
					this.$axios.post(
						'/projectInfoImg/selectAllByInfoId', {
							infoId: this.postinfoid
						}
					).then(res => {
						if (res.success) {
							this.imagelist = res.data;
							this.formimglist = [];
						} else {
							this.$message.error("获取图片错误,请重试");
						}
					})
					this.form = {};
					this.loading = false;
					this.infoimgVisible = false;
				});
				this.loading = false;
			},

			addimg() {
				this.form = {};
				this.formImgListArr = '';
				this.formimglist = [];
				this.imgx = "";
				this.infoimgVisible = true;
			},

			handleEditImg(index, row) {
				this.form = {};
				this.formImgListArr = '';
				this.formimglist = [];
				this.$axios.post(
					'/projectInfoImg/selectAllByInfoId', {
						infoId: row.id
					}
				).then(res => {
					if (res.success) {
						this.imagelist = res.data;
						this.postinfoid = row.id;
						this.imgVisible = true;
					} else {
						this.$message.error("获取图片错误,请重试");
					}
				})
			},


			reset() {
				this.$forceUpdate;
			},


			saveInfoEdit() {
				this.loading = true;
				
				
				this.$refs.pjcInfoform.validate(valid => {
					if (valid) {
						/* 添加 */
						const subData = this.form;
						subData.date = new Date(this.form.date).format("yyyy/MM/dd hh:mm:ss");
						subData["projectId"] = this.pjcId;
						subData.image = this.imgx;
						if (this.form.id == '' || this.form.id == null) {
							
							if(this.imgx==""||this.imgx==null||this.imgx==[]){
								this.$message.error("请添加缩略图");
								this.loading = false;
								return;
							}
							let fd = JSON.parse(JSON.stringify(subData));
							delete fd.id;
							this.$axios.post('/projectInfo/addProjectInfo', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`添加成功`);
								this.getData();
								this.form = {};
								this.loading = false;
								this.editPjcInfoVisible = false;
							});
							this.loading = false;
						} else {
							/* 更新 */
							this.loading = true;
							let fd = JSON.parse(JSON.stringify(subData));
							this.$axios.post('/projectInfo/upProjectInfo', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`修改成功`);
								this.form = {};
								this.getData();
								this.loading = false;
								this.editPjcInfoVisible = false;
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
				new Date().startDay(new Date, "reset");
				this.startDay = null;
				this.idx = index;
				this.imagedatelist = [];
				this.imagedatelist.push({
					name: row.image,
					url: row.image
				});
				this.editPjcInfoVisible = true;
			},

			addInfo() {
				new Date().startDay(new Date, "reset");
				this.startDay = null;
				this.$forceUpdate;
				this.imgx = "";
				this.form = {};
				this.imagedatelist = [];
				this.editPjcInfoVisible = true;
			},

			handleAdd(index, row) {
				new Date().startDay(row.date, "set");
				this.startDay = row.date;
				this.form = {};
				this.imagedatelist = [];
				this.editPjcInfoVisible = true;
			},
			handleDelete(index, row) {
				this.$axios.post(
					'/projectInfo/delProjectInfoById', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功')
						this.getData();
					}
				})
			},

			formatRowData(row, column) {
				var returnData;
				switch (column.property) {
					case "date":
						returnData = new Date(row.date).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "staffId":
						this.staffInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.staffId == username) {
								returnData = item.name;
							}
						});
						break;
					case "completionStatus":
						switch (row.completionStatus) {
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
					case "remark":
						if (row.remark == "" || row.remark == null) {
							returnData = "无备注";
						} else {
							returnData = row.remark;
						}
						break;

					case "createTime":
						returnData = new Date(row.createTime).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "updateTime":
						returnData = new Date(row.updateTime).format("yyyy/MM/dd hh:mm:ss");
						break;
					case "createUserId":
						this.adminInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.createUserId == username) {
								returnData = item.name;
							}
						});
						break;
					case "updateUserId":
						this.adminInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.updateUserId == username) {
								returnData = item.name;
							}
						});
						break;
				}
				return returnData;
			},

			getAdminInfo() {
				this.$axios
					.post('/admin/getAdminById', {})
					.then(res => {
						this.adminInfo = res.data.records;
					});
			},

			getStaffInfo() {
				this.$axios
					.post('/staff/selectAll', {})
					.then(res => {
						this.staffInfo = res.data.records;
					});
			},

			getPjcInfo() {
				this.$axios
					.post('/project/selectProject', {
						accomplishStatus: this.status,
					})
					.then(res => {
						this.pjcInfo = res.data.records;
					});
			},

			getData() {
				this.loading = true;
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.$axios
					.post('/projectInfo/selectProjectInfo', {
						projectId: this.pjcId,
					})
					.then(res => {
						this.tableData = res.data.records;
						this.tableData.forEach((item) => {
							switch (item.completionStatus) {
								case "notStart":
									item["color"] = "#66ccff";
									break;
								case "having":
									item["color"] = "#55ff00";
									break;
								case "finished":
									item["color"] = "#e4e7ed";
									break;
							}
							this.staffInfo.forEach((items) => {
								if (item.staffId == items.id) {
									item["staffName"] = items.name;
									item["staffPhone"] = items.phone;
								}
							})
						});
						this.totalCount = res.data.total;
					});
				this.loading = false;
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
			imgRemove1() {
				this.$message.success('图片删除成功');
				this.imgx = "";
			},

			imgsuccess2(url) {
				this.$message.success('图片上传成功');
				this.formImgListArr = url;
			},
			imgRemove2() {
				this.$message.success('图片删除成功');
				this.formImgListArr = "";
			},
		}
	};
</script>

<style scoped>
	.el-dialog__body{
		overflow-y: auto;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 480px;
	}

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

	.el-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
</style>
