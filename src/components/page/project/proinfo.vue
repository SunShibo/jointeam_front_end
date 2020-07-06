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
						<el-select @focus="getPjcInfo" filterable v-model="pjcId" placeholder="请选择项目" style="width: 300px;">
							<el-option v-for="item in pjcInfo" :key="item.id" :label="'id:'+item.id+' 项目名称:'+item.projectName" :value="item.id"></el-option>
						</el-select>
					</template>
				</div>

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
						<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
						<el-table-column sortable :formatter="formatRowData" :show-overflow-tooltip="true" prop="date" align="center"
						 label="日期"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="title" align="center" label="标题"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="staffId" align="center" label="负责人"></el-table-column>
						<el-table-column :formatter="formatRowData" sortable :show-overflow-tooltip="true" prop="completionStatus" align="center"
						 label="完成状态"></el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="content" align="center" label="内容"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="remark" align="center" label="备注"></el-table-column>
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

						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="createTime" align="center" label="创建时间"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="updateTime" align="center" label="修改时间"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="createUserId" align="center"
						 label="创建人"></el-table-column>
						<el-table-column :formatter="formatRowData" :show-overflow-tooltip="true" prop="updateUserId" align="center"
						 label="修改人"></el-table-column>

						<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
							<template slot-scope="scp">
								<el-button type="text" icon="el-icon-edit" @click="handleEdit(scp.$index, scp.row)">修改项目流程</el-button>
								<el-button type="text" icon="el-icon-bottom" @click="handleAdd(scp.$index, scp.row)">向下插入项目流程</el-button>
								<el-button type="text" icon="el-icon-edit" @click="handleEditImg(scp.$index, scp.row)">查看/修改项目流程图片</el-button>
								<el-button type="text" icon="el-icon-download" @click="openFile(scp.$index, scp.row)">查看附件</el-button>

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
			<el-card class="box-card" style="width: 100%;">
				<div class="block">
					<div v-if="tableData!=null&&tableData!=''" style="height:500px;overflow:auto;">
						<el-timeline>
							<el-timeline-item v-for="(item,index) in tableData" :key="index" :color="item.color" :timestamp="item.date | formatDate"
							 placement="top">
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
		</div>

		<el-dialog title="新增项目附件" :visible.sync="addFileVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="projectform" :model="fileForm" label-width="50px">
				<el-form-item label-width="100px" label="附件名称" prop="name" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<el-input v-model="fileForm.name"></el-input>
				</el-form-item>

				<el-form-item label-width="100px" label="详细照片" prop="path">
					<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="filesuccess2" :onUpLoadRemove="fileRemove2"
					 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="*" :fileList="formfilelist"
					 :filesNumber="1">
					</upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<!-- saveProjectEdit('form') -->
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveFileEdit()">确
					定</el-button>
				<el-button @click="addFileVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<el-dialog title="新增/编辑项目附件" :visible.sync="fileVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-button type="primary" icon="add" @click="addFiles">添加附件</el-button>
			<el-table max-height="550px" :data="tableFileData" border class="table" ref="multipleTable">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="附件名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="path" align="center" label="附件地址"></el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
					<template slot-scope="scp">
						<el-button type="text" icon="el-icon-download" @click="downloadFile(scp.$index, scp.row)">下载附件</el-button>
						<el-popconfirm title="确认删除此附件吗？" @onConfirm="handleDeleteFile(scp.$index, scp.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51!important">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="fileVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

		<!-- 添加/编辑项目流程 -->
		<el-dialog @open="init" title="新增/编辑项目流程" :visible.sync="editPjcInfoVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="pjcInfoform" :model="form" label-width="50px">
				<el-form-item label-width="100px" label="标题" prop="title" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' },{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<el-input v-model="form.title"></el-input>
				</el-form-item>

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
						<el-select @focus="getStaffInfo" filterable v-model="form.staffId" placeholder="请选择员工">
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

				<!-- <div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="附件" prop="file">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="filesuccess1" :onUpLoadRemove="fileRemove1"
						 :onUpLoadError="onUpLoadError" :multiple="false" :drag="true" :show-file-list="true" accept="*" :fileList="filedatelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div> -->
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
				editorsVideoList: [],
				editorsList: [],
				tableFileData: [],

				formfilelist: [],
				fileVisible: false,

				addFileVisible: false,

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

				pId: "",
				fileForm: {},

				filedatelist: [],


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
					},
					{
						id: 4,
						name: "已暂停",
						ename: "stopping"
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
					},
					{
						id: 3,
						name: "已暂停",
						ename: "stopping"
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
				filedatelist: [],
				imgx: "",
				filex: "",
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
					case "stopping":
						return "暂停中";
						break;
				}
			},
		},

		watch: {
			'$route.params'(val, oldVal) {
				console.log(val);
				if(val.id!="" && val.id!= null && val.id!=NaN && val.id!={}){
					console.log(val);
					this.pjcId = parseInt(val.id)
				}
			},
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
			this.pjcId = parseInt(this.$route.params.id)
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

			openFile(index, row) {
				this.pId = row.id;
				this.getFile(row.id);
				this.fileVisible = true;
			},

			saveFileEdit() {
				let fd = {
					name: this.fileForm.name,
					path: this.fileForm.path,
					type: "info",
					pId: this.pId
				}
				this.$axios.post('/accessory/addAccessory', fd).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.$message.success(`操作成功`);
					this.getFile(this.pId);
					this.addFileVisible = false;
				});
			},


			downloadFile(index, row) {
				if (row.path == "" || row.path == null || row.path == "无") {
					this.$message.error("所选项目未上传附件");
				} else {
					//window.location.href = row.file;
					window.open(row.path, "_blank")
				}
			},

			getFile(id) {
				this.$axios.post(
					'/accessory/queryAll', {
						pId: id,
						type: "info"
					}
				).then(res => {
					if (!res.success) {
						this.$message.error("获取附件信息失败");
						return;
					}
					this.tableFileData = res.data;
				})
			},

			handleDeleteFile(index, row) {
				this.$axios.post(
					'/accessory/delById', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功')
						this.getFile(this.pId);
					}
				})
			},



			addFiles() {
				this.fileForm = {};
				this.formfilelist = [];
				this.addFileVisible = true;
			},

			imgsuccess2(url) {
				this.$message.success('附件上传成功');
				this.fileForm.path = url;
			},

			imgRemove2() {
				this.$message.success('文件删除成功');
				this.fileForm.path = "";
			},

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
				if (this.formImgListArr == "" || this.formImgListArr == null) {
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
				this.filex = "";
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

				this.$refs.pjcInfoform.validate(valid => {
					if (valid) {
						/* 添加 */
						const subData = this.form;
						subData.date = new Date(this.form.date).format("yyyy/MM/dd hh:mm:ss");
						subData["projectId"] = this.pjcId;
						subData.image = this.imgx;
						subData.file = this.filex;
						if (this.form.id == '' || this.form.id == null) {
							if (this.form.image == '' || this.form.image == null) {
								this.form.image = "https://zjtc-bucket-01.oss-cn-beijing.aliyuncs.com/wxapp/WXxS8D_1592314162761.jpg";
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
				this.filedatelist = [];

				this.imagedatelist.push({
					name: row.image,
					url: row.image
				});
				if (row.file == "" || row.file == null || row.file == "无") {

				} else {
					this.filedatelist.push({
						name: row.file,
						url: row.file
					});
				}

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
				this.editPjcInfoVisible = true;
			},

			addInfo() {
				new Date().startDay(new Date, "reset");
				this.filedatelist = [];
				this.startDay = null;
				this.$forceUpdate;
				this.imgx = "";
				this.filex = "";
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
							case "stopping":
								returnData = "暂停中";
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
					.post('/project/selectIdAndTitle', {
						accomplishStatus: this.status,
					})
					.then(res => {
						this.pjcInfo = res.data;
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
								case "stopping":
									item["color"] = "#de8d01";
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
			filesuccess2(url) {
				this.$message.success('附件上传成功');
				this.fileForm.path = url;
			},

			fileRemove2() {
				this.$message.success('文件删除成功');
				this.fileForm.path = "";
			},

			imgRemove1() {
				this.$message.success('图片删除成功');
				this.imgx = "";
			},

			filesuccess1(url) {
				this.$message.success('附件上传成功');
				this.filex = url;
			},
			fileRemove1() {
				this.$message.success('附件删除成功');
				this.filex = "无";
				this.subData.file = "无";
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
	.el-dialog__body {
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
