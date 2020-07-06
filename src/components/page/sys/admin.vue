<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 用户列表
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<!--        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
				<el-input v-model="s_name" placeholder="用户名" class="handle-input mr10"></el-input>
				<!--<el-input v-model="s_name" placeholder="姓名" class="handle-input mr10"></el-input>-->
				<!--<el-input v-model="s_role" placeholder="角色" class="handle-input mr10"></el-input>-->
				<el-select @focus="getRole" v-model="s_role" placeholder="请选择角色" style="margin-right:10px;">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
				</el-select>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add" @click="add">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column prop="name" label="用户名"></el-table-column>
				<el-table-column prop="phoneNumber" label="手机号"></el-table-column>
				<!--<el-table-column prop="name" label="姓名"></el-table-column>-->
				<el-table-column prop="roleName" label="角色"></el-table-column>

				<el-table-column label="操作" width="280" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-edit" @click="handlePasswordEdit(scope.$index, scope.row)">设置密码</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
				</el-pagination>

			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="userform" :model="form" :rules="rules" label-width="50px">
				<el-form-item label-width="100px" label="用户名" prop="name" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="密码" v-show="show" prop="password" :rules="show?[{required: true, message: '该项不能为空', trigger: 'blur'}]:[]">
					<el-input type="password" v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="手机号" prop="phoneNumber">
					<el-input v-model="form.phoneNumber"></el-input>
				</el-form-item>
				<!--<el-form-item label="邮箱" prop="email">-->
				<!--<el-input v-model="form.email"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item label-width="100px" label="角色" prop="roleId" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
					<el-select @focus="getRole" v-model="form.roleId" clearable placeholder="请选择" style="width:260px">
						<el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit('form')">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 密码设置弹出框 -->
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

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import menu from '../../common/menu'
	export default {
		name: 'user',
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else if (value.length < 6 || value.length > 18) {
					callback(new Error('密码长度错误'));
				} else {
					if (this.form.password !== '') {
						this.$refs.form.validateField('passowrd');
					}
					callback();
				}
			};
			// 手机号验证
			var checkPhone = (rule, value, callback) => {
				const phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
				if (!value) {
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {

					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			};
			return {
				loading: true,

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
				s_roleId: "",
				s_name: "",
				s_mobile: "",
				s_role: "",
				show: true,
				genders: [{
					key: "man",
					v: "男"
				}, {
					key: "normal",
					v: "女"
				}],
				options: [],
				tableData: [],
				cur_page: 1,
				multipleSelection: [],
				select_cate: "",
				select_word: "",
				del_list: [],
				is_search: false,
				editVisible: false,
				passwordVisible: false,
				delVisible: false,
				form: {
					name: "",
					id: "",
					password: "",
					gender: "",
					roleId: "",
					phoneNumber: ""
				},
				idx: -1,
				menu: menu,
				defaultProps: {
					children: "children",
					label: "label"
				},
				count: 0,
				value: "male",
				rules: {
					name: [{
							required: true,
							message: "请输入姓名",
							trigger: "blur"
						},
						{
							min: 2,
							max: 10,
							message: "长度在 2 到 10 个字符",
							trigger: "blur"
						}
					],
					phoneNumber: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],

					roleId: [{
						required: true,
						message: "请选择一个角色",
						trigger: "change"
					}],

					email: [{
						required: true,
						message: "请输入邮箱",
						trigger: "blur"
					}]

				}
			};
		},
		created() {
			this.getData();
			this.getRole();
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

			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.loading = true;
				this.$axios.post("/admin/getAdminById", {
					pageNo: this.currentPage,
					pageSize: this.PageSize,
					roleId: this.s_role,
					userName: this.s_name,
				}).then(res => {
					this.tableData = res.data.records;

					this.totalCount = res.data.total;
				});
				this.loading = false;
			},
			getRole() {
				// this.$axios.post(this.url, {
				this.loading = true;
				this.$axios.post("/admin/getRoleList", {}).then(res => {
					this.options = res.data;
				});
				this.loading = false;
			},
			search() {
				this.currentPage = 1;
				this.getData();
			},
			add() {
				//添加
				this.editVisible = true;

				setTimeout(() => {
					this.$refs['userform'].resetFields();
					this.form = {
						name: "",
						id: "",
						password: "",
						gender: "male",
						roleId: "",
						email: "",
						phoneNumber: ""
					};
				}, 200);
				this.show = true;
			},

			handleEdit(index, row) {
				this.show = false;
				this.idx = index;
				const item = this.tableData[index];

				this.form = {
					name: item.name,
					id: item.id,
					gender: item.gender,
					roleId: item.roleId,
					email: item.email,
					phoneNumber: item.phoneNumber
				};

				this.editVisible = true;
			},
			handlePasswordEdit(index, row) {
				this.show = false;
				this.idx = index;
				const item = this.tableData[index];

				this.form = {
					name: item.name,
					id: item.id,
					gender: item.gender,
					roleId: item.roleId,
					email: item.email,
					phoneNumber: item.phoneNumber
				};

				this.passwordVisible = true;
			},
			handleDelete(index, row) {
				this.form = row;
				this.idx = index;
				this.delVisible = true;
			},
			delAll() {
				const length = this.multipleSelection.length;
				if (length == 0) return;
				if (!confirm(`您确定要删除 ${length} 条数据吗？`)) return;
				let str = [];
				// this.del_list = this.del_list.concat(this.multipleSelection);
				for (let i = 0; i < length; i++) {
					str.push(this.multipleSelection[i]["id"]);
				}
				this.loading = true;
				this.$axios
					.post("/admin/delAdmin", {
						ids: str.join(",")
					})
					.then(res => {
						if (!res.success) {
							this.$message.error(res.errMsg);
							this.loading = false;
							return;
						}

						this.$message.success("删除成功");
						this.delVisible = false;
						this.getData();
					});
				this.loading = false;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// savePassword，设置密码编辑保存
			// 保存编辑
			savePassword(formName) {
				if (this.form.password.length < 6 || this.form.password.length > 18) {
					this.$message.error("密码长度需设置6到18位");
					return false;
				}
				this.loading = true;
				this.$axios.post("/admin/changePassword", {
					id: this.form.id,
					passWord: this.form.password
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

			//添加 或者 编辑管理员
			saveEdit(formName) {
				// admin/adminRegister
				this.$refs.userform.validate(valid => {
					if (valid) {
						if (this.form.id == "") {
							if (this.form.password.length < 6 || this.form.password.length > 18) {
								this.$message.error(`密码需要设置6到18位`);
								return false;
							}
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.loading = true;
							this.$axios.post("/admin/adminRegister", fd).then(res => {
								if (!res.success) {
									this.$message.error(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.editVisible = false;
							});
							this.loading = false;
						} else {

							this.$axios.post("/admin/updateAdminUser", this.form).then(res => {
								if (!res.success) {
									this.$message.error(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.editVisible = false;
							});
							this.loading = false;
						}
					} else {
						console.error("error submit!!");
						return false;
					}
				});

			},
			// 确定删除
			deleteRow() {
				var id = this.form.id;
				id = "[" + id + "]";
				this.loading = true;
				this.$axios
					.post("/admin/delAdmins", {
						idArr: id
					})
					.then(res => {
						if (!res.success) {
							this.$message.error(res.errMsg);
							return;
						}
						this.tableData.splice(this.idx, 1);
						this.$message.success("删除成功");
						this.delVisible = false;
					});
				this.loading = false;
			}
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
</style>
