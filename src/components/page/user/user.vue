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
				<el-select @focus="getSelect" v-model="s_value" placeholder="请选择" style="margin-right: 2%">
					<el-option value="">全部</el-option>
					<el-option v-for="item in options" :key="item.id" :label="item.unitName" :value="item.id">
					</el-option>
				</el-select>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="search" @click="add">添加</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" v-loading="$store.state.requestLoading">
				<el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="头像" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.head" width="70" height="70" />
					</template>
				</el-table-column>
				<el-table-column prop="name" label="用户名" align="center" width="90" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="phone" label="手机号" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="company" label="机构" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="weChat" label="微信号" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="mailbox" label="邮箱" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="birthday" label="生日" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="sex" label="性别" align="center" width="70" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="upd(scope.row)">编辑
						</el-button>
						<el-button type="text" icon="el-icon-edit" @click="handlePasswordEdit(scope.$index,scope.row)">修改密码
						</el-button>
						<el-button type="text" icon="el-icon-edit" @click="inform(scope.row)">通知
						</el-button>
						<el-popconfirm title="确认禁用此用户吗？" @onConfirm="handleDelete(scope.row)">
							<el-button slot="reference" v-if="scope.row.status=='yes'" type="text" icon="el-icon-delete" style="color: #ff4d51">禁用
							</el-button>
							<el-button slot="reference" v-if="scope.row.status=='no'" type="text" icon="el-icon-delete" style="color: #ff4d51">启用
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
				</el-pagination>
			</div>
		</div>


		<el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="form" :rules="rules">
				<el-row>
					<el-col :span="12" style="border-right: 1px #666666 solid">
						<div class="grid-content bg-purple">

							<el-form-item label="姓名：" prop="name">
								<el-input style="width: 300px" v-model="form.name" size="mini" class="inputform"></el-input>
							</el-form-item>
							<el-form-item label="手机号" prop="phone">
								<el-input style="width: 300px" v-model="form.phone" size="mini" class="inputform"></el-input>
							</el-form-item>
							
							<el-form-item v-if="showPwd" label="密码" prop="password">
								<el-input type="password" style="width: 300px" v-model="form.password" size="mini" class="inputform"></el-input>
							</el-form-item>
							
							
							<el-form-item label="机构：" prop="companyId">
								<el-select @focus="getSelect" v-model="form.companyId" placeholder="请选择" style="margin-right: 2%">
									<el-option v-for="item in options" :key="item.id" :label="item.unitName" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item style="width: 300px" label="头像">
								<upLoad id-name="team" :fileList="fileList" :onUpLoadSuccess="onUpLoadSuccess" :onUpLoadError="onUpLoadError"
								 :filesNumber="1" :showFileList="true"></upLoad>
							</el-form-item>

						</div>
					</el-col>
					<el-col :span="12">
						<div class="grid-content bg-purple" style="margin-left: 60px">
							<el-form-item label="微信号">
								<el-input style="width: 300px" v-model="form.weChat" size="mini" class="inputform"></el-input>
							</el-form-item>
							<el-form-item label="邮箱：">
								<el-input style="width: 300px" v-model="form.mailbox" size="mini" class="inputform"></el-input>
							</el-form-item>
							<el-form-item label="性别：">
								<el-radio v-model="form.sex" label="男">男</el-radio>
								<el-radio v-model="form.sex" label="女">女</el-radio>
							</el-form-item>
							<el-form-item label="生日：">
								<el-date-picker v-model="form.birthday" format="yyyy/MM/dd" value-format="yyyy/MM/dd" type="date" placeholder="选择生日">
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

		<!--通知-->
		<el-dialog title="添加通知" :visible.sync="dialogInfo" :close-on-click-modal="closeOnClickModal">
			<el-button type="text" style="margin-bottom: 1%" @click="informAdd">添加
			</el-button>
			<el-table :data="tableData1" border class="table" ref="multipleTable" v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="图片" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.image" width="70" height="70" />
					</template>
				</el-table-column>
				<el-table-column prop="title" label="标题" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="content" label="内容" align="center" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1"
				 :page-sizes="pageSizes1" :page-size="PageSize1" layout="total, sizes, prev, pager, next, jumper" :total="totalCount1">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogInfo = false">取 消</el-button>
				<el-button type="primary" @click="dialogInfo = false">确 定</el-button>
			</div>
		</el-dialog>


		<!--添加通知-->
		<el-dialog title="添加通知" :visible.sync="dialogInfoadd" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="formInfo" :rules="rules1">
				<el-row>
					<el-col :span="12" style="border-right: 1px #666666 solid">
						<div class="grid-content bg-purple">
							<el-form-item label="标题：" prop="title">
								<el-input style="width: 300px" v-model="formInfo.title" size="mini" class="inputform"></el-input>
							</el-form-item>
							<el-form-item label="内容：" prop="content">
								<el-input style="width: 300px" v-model="formInfo.content" size="mini" class="inputform"></el-input>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						<el-form-item style="margin-left:10%;width: 300px" label="图片" prop="head">
							<upLoad id-name="team1" :fileList="fileList1" :onUpLoadSuccess="onUpLoadSuccess1" :onUpLoadError="onUpLoadError1"
							 :filesNumber="1" :showFileList="true"></upLoad>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogInfoadd = false">取 消</el-button>
				<el-button type="primary" @click="dialogInfoSave('form')">确 定</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="" :visible.sync="passwordVisible" width="50%">
			<el-form ref="passwordForm" :model="form" :rules="rules" label-width="50px">
				<el-form-item label="用户" prop="name" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
					<el-input v-model="form.name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
					<el-input type="password" v-model="form.password"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="passwordVisible = false">取 消</el-button>
				<el-button type="primary" @click="savePassword('passwordForm')">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	import menu from '../../common/menu'
	import upLoad from '../../common/Upload'

	export default {
		name: 'user',
		components: {
			upLoad
		},
		data() {
			return {
				dialogInfo: false,
				dialogInfoadd: false,
				fileList: [],
				fileList1: [],
				dialogFormVisible: false,
				
				passwordVisible: false,
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
				formInfo: {
					userId: '',
					content: '',
					title: '',
					image: '',
				},
				row: '',
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

				// 总数据
				tableData1: [],
				// 默认显示第几页
				currentPage1: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount1: 0,
				// 个数选择器（可修改）
				pageSizes1: [10, 20, 50, 100],
				// 默认每页显示的条数（可修改）
				PageSize1: 10,

				s_name: "",
				s_phone: "",
				s_value: "",
				patriarch: [],
				count: 0,
				rules: {
					companyId: [{
						required: true,
						message: "请输选择",
						trigger: "blur"
					}],
					name: [{
						required: true,
						message: "请输入姓名",
						trigger: "blur"
					}],
					phone: [{
						required: true,
						message: "请输入手机号",
						trigger: "blur"
					}],
				},
				options: [],


				rules1: {
					title: [{
						required: true,
						message: "请输入标题",
						trigger: "blur"
					}],
					content: [{
						required: true,
						message: "请输内容",
						trigger: "blur"
					}],
				},
				
				showPwd:false,
			};
		},
		created() {
			this.getData();
			this.getSelect();
		},
		methods: {
			handlePasswordEdit(index, row) {
				const item = this.tableData[index];
			
				this.form = {
					name: item.name,
					id: item.id,
					phone: item.phone,
					companyId: item.companyId,
					weChat: item.weChat,
					mailbox: item.mailbox,
					head:item.head,
					sex:item.sex,
					birthday:item.birthday
				};
			
				this.passwordVisible = true;
			},
			
			
			inform(row) {
				this.fileList1 = [];
				this.formInfo = {
					userId: row.id,
					content: '',
					title: '',
					image: '',
				};
				this.row = row;
				this.getInform(row);
				this.dialogInfo = true;
			},
			informAdd() {
				this.formInfo = {};
				this.dialogInfoadd = true;
			},
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

			// 每页显示的条数
			handleSizeChange1(val) {
				// 改变每页显示的条数
				this.PageSize1 = val
				// 点击每页显示的条数时，显示第一页
				this.getInform(this.row)
				// 注意：在改变每页显示的条数时，要将页码显示到第一页
				this.currentPage1 = 1
			},
			// 显示第几页
			handleCurrentChange1(val) {
				// 改变默认的页数
				this.currentPage1 = val
				// 切换页码时，要获取每页显示的条数
				this.getInform(this.row)
			},
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
			getInform(row) {
				this.loading = true;
				this.$axios.post("/inform/query", {
					pageNo: this.currentPage1,
					pageSize: this.PageSize1,
					userId: row.id,
				}).then(res => {
					this.tableData1 = res.data.records;
					this.totalCount1 = res.data.total;
				});
				this.loading = false;
				this.dialogInfo = true;
			},
			getSelect() {
				this.$axios.post("/organ/queryByWechatId", {}).then(res => {
					this.options = res.data;
				});
			},
			search() {
				this.getData();
			},

			/**
			 * 上传成功后的回调
			 */
			onUpLoadSuccess(uploadUrl) {
				this.fileList = [];
				this.fileList.push({
					name: uploadUrl,
					url: uploadUrl
				});
				this.form.head = uploadUrl;
			},
			/**
			 * 上传失败后的回调
			 */
			onUpLoadError(err) {
				console.log(err)
				this.$message.error('上传失败')
			},

			/**
			 * 上传成功后的回调
			 */
			onUpLoadSuccess1(uploadUrl) {
				console.log(uploadUrl)
				this.fileList1 = [];
				this.fileList1.push({
					name: uploadUrl,
					url: uploadUrl
				});
				this.formInfo.image = uploadUrl;
			},
			/**
			 * 上传失败后的回调
			 */
			onUpLoadError1(err) {
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
				this.showPwd = true;
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
				this.showPwd = false;
				this.form = {};
				this.fileList = [];
				this.fileList.push({
					name: row.head,
					url: row.head
				});
				this.form = row;
				this.dialogFormVisible = true;
			},
			dialogInfoSave(formName) {
				this.$refs.courseform.validate(valid => {
					if (valid) {
						let fd = JSON.parse(JSON.stringify(this.formInfo));
						this.$axios.post('/inform/add', fd).then(res => {
							if (!res.success) {
								this.$message.error(res.errMsg);
								return;
							}
							this.$message.success(`操作成功`);
							this.getInform(this.row);
							this.dialogInfoadd = false;
						});
					} else {
						console.error('error submit!!');
						this.loading = false;
						return false;
					}
				});
			},
			
			
			savePassword(formName) {
				if (this.form.password.length < 6 || this.form.password.length > 18) {
					this.$message.error("密码长度需设置6到18位");
					return false;
				}
				this.loading = true;
				this.$axios.post("/backUser/update", {
					id: this.form.id,
					password: this.form.password
				}).then(res => {
					if (!res.success) {
						this.$message.error(res.errMsg);
						this.loading = false;
						return;
					}
					this.$message.success(`操作成功`);
					this.getData();
					this.passwordVisible = false;
				});
				this.loading = false;
			},
			
			
			
			
			saveEdit(formName) {
				
				
				
				this.$refs.courseform.validate(valid => {
					if (valid) {
						/* 添加 */
						if (this.form.id == '' || this.form.id == null) {
							if (this.form.password.length < 6 || this.form.password.length > 18) {
								this.$message.error(`密码需要设置6到18位`);
								return false;
							}
							if (this.form.head == '' || this.form.head == null) {
								this.form.head = "https://zjtc-bucket-01.oss-cn-beijing.aliyuncs.com/wxapp/EhEEXa_1591773064554.png";
							}
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							alert(this.form.head);
							this.$axios.post('/backUser/add', fd).then(res => {
								if (!res.success) {
									this.$message.error(res.errMsg);
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
									this.$message.error(res.errMsg);
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.dialogFormVisible = false;
							});
						}
					} else {
						console.error('error submit!!');
						this.loading = false;
						return false;
					}
				});
			},
			handleDelete(row) {
				/* 更新 */
				this.$axios.post('/backUser/delete', {
					id: row.id
				}).then(res => {
					if (!res.success) {
						this.$message.error(res.errMsg);
						return;
					}
					this.$message.success(`操作成功`);
					this.getData();
				});
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

	.querySize {
		width: 200px;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>
