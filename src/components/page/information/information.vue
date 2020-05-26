<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">行业资讯</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="infoName" placeholder="资讯标题" class="handle-input mr10"></el-input>
				<el-date-picker :editable="false" v-model="selectTimeData" type="datetimerange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>

				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add">新增</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="multipleTable">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="title" label="标题"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="source" label="来源"></el-table-column>
				<el-table-column width="120" height="60" prop="image" label="封面图">
					<template slot-scope="scope">
						<img :src="scope.row.image" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="lable" label="标签"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="content" label="内容"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="status" label="状态"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="createTime" label="创建时间"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="createUserId" label="创建用户的id"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="updateUserId" label="更新用户的id"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="sort" label="排列顺序"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import menu from '../../common/menu';
	import upload from '../../common/Upload.vue';

	export default {
		name: 'infomation',
		components: {
			upload
		},
		data() {
			return {
				loading: true,

				selectTimeData: [],

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
			// 获取 easy-mock 的模拟数据
			getData() {
				this.loading = true;
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				var startTime = null;
				var endTime = null;
				if (this.selectTimeData[0] == [] || this.selectTimeData[0] == null) {} else {
					startTime = new Date(this.selectTimeData[0]).format("yyyy-MM-dd");
					endTime = new Date(this.selectTimeData[1]).format("yyyy-MM-dd");
				}
				this.$axios
					.post('/industry/selectIndustry', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						title: this.infoName,
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
				this.$message('出现错误，请重新尝试');
			},
			imgsuccess1(url) {
				this.$message('图片上传成功');
				this.form.headPic = url;
			},
			imgRemove1() {
				this.$message('图片删除成功');
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
