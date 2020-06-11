<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades">项目模板</i>
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-upload" @click="add" class="handle-input-search">
					添加项目模板
				</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" v-loading="$store.state.requestLoading">
				<el-table-column type="index" width="50" label="编号" align="center"></el-table-column>
				<el-table-column prop="name" label="模板名称" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate"></el-table-column>
				<el-table-column label="操作" width="300" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
						</el-button>

						<el-button type="text" icon="el-icon-edit" @click="getTempInfo(scope.row)">编辑模板详细节点
						</el-button>

						<el-popconfirm title="确认删除此数据吗？" @onConfirm="handleDelete(scope.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog title="添加/编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="form" :rules="rules">
				<el-form-item label="模板名称" prop="name" style="margin-left: 4%">
					<el-input v-model="form.name" size="mini" class="inputform" style="width: 40%;margin-left: 4%"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog width="80%" title="添加/编辑模板详细节点" :visible.sync="projectInfoTempVisible" :close-on-click-modal="closeOnClickModal">
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-upload" @click="addNode" class="handle-input-search">
					添加模板节点
				</el-button>
			</div>

			<el-table :data="tempTableData" border class="table" ref="multipleTable" v-loading="$store.state.requestLoading">
				<el-table-column type="index" width="50" label="编号" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="title" label="标题" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" :formatter="formatRowData" prop="staffId" label="负责人id" align="center"></el-table-column>

				<el-table-column width="120" height="60" align="center" pro0o-pp="image" label="项目略缩图">
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

				<el-table-column prop="completionStatus" label="进行状态" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="content" label="内容" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="createUserId" label="创建人id" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="updateUserId" label="更新人id" align="center"></el-table-column>

				<el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate"></el-table-column>
				<el-table-column label="操作" width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
						</el-button>

						<el-popconfirm title="确认删除此数据吗？" @onConfirm="handleDelete(scope.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>


			<div slot="footer" class="dialog-footer">
				<el-button @click="projectInfoTempVisible = false">取 消</el-button>
				<el-button type="primary" @click="projectInfoTempVisible = false">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import menu from '../../common/menu'
	import upLoad from '../../common/Upload'

	export default {
		name: 'templatetype',
		data() {
			return {
				loading: false,
				tableData: [],
				tempTableData: [],
				dialogFormVisible: false,
				projectInfoTempVisible: false,
				form: {
					id: '',
					type: '',
				},
				visible: false,
				rules: {
					type: [{
						required: true,
						message: "请输入模板名称",
						trigger: "blur"
					}],
				},
			};
		},
		created() {
			this.getData();
		},
		methods: {
			/* formatRowData(row, column) {
				var returnData;
				switch (column.property) {
					case "date":
						this.staffInfo.forEach((item, index, value) => {
							var username = item.id;
							if (row.staffId == username) {
								returnData = item.name;
							}
						});
					case "":

				}
			}, */

			getData() {
				this.loading = true;
				this.$axios.post("/projectInfoTemp/selectInfoTemp", {}).then(res => {
					this.tableData = res.data;
				});
				this.loading = false;
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
				this.form = {
					id: '',
					type: '',
				};
				this.dialogFormVisible = true;
			},
			handleEdit(row) {
				this.form = row;
				this.dialogFormVisible = true;
			},

			getTempInfo(row) {
				this.loading = true;
				this.$axios.post("/projectInfoTempInfo/selectInfoTempInfoByInfoTempId", {
					infoTempId: row.id
				}).then(res => {
					if (!res.success) {
						this.$message.error("获取数据失败,请稍后重试");
						this.loading = false;
						return;
					}
					this.tempTableData = res.data;
					console.log(JSON.stringify(res.data));
					this.projectInfoTempVisible = true;
				});
				this.loading = false;
			},

			saveEdit(formName) {
				this.$refs.courseform.validate(valid => {
					if (valid) {
						/* 添加 */
						if (this.form.id == '' || this.form.id == null) {
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.$axios.post('/projectInfoTemp/addInfoTemp', fd).then(res => {
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
							this.$axios.post('/projectInfoTemp/updateInfoTemp', this.form).then(res => {
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
						return false;
					}
				});
			},
			handleDelete(row) {
				this.$axios.post('/projectInfoTemp/deleteInfoTemp', {
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
