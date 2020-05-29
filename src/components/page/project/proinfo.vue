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
						<span>项目状态:  </span>
						<el-select v-model="status" placeholder="请选择状态">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.ename"></el-option>
						</el-select>
					</template>
					
					<template>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;    选择项目:&nbsp;&nbsp;&nbsp;</span>
						<el-select filterable v-model="pjcId" placeholder="请选择项目" style="width: 300px;">
							<el-option v-for="item in pjcInfo" :key="item.id" :label="'id:'+item.id+' 项目名称:'+item.projectName" :value="item.id"></el-option>
						</el-select>
					</template>
				</div>
				<div class="block">
					<div v-if="tableData!=null&&tableData!=''">
						<el-timeline>
							<el-timeline-item v-for="item in tableData" timestamp="2018/4/12" placement="top">
								<el-card>
									<h4>{{item.title}}</h4>
									<p>{{item.staffId}}{{item.content}}</p>
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
				pjcId: "",
				pjcInfo: "",
				status:null,
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
			};
		},
		
		watch:{
			status(vel){
				this.getPjcInfo();
			},
			pjcId(vel){
				this.getData();
			}
		},
		
		created() {
			this.getPjcInfo();
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
				this.$message('出现错误，请重新尝试');
			},
			imgsuccess1(url) {
				this.$message('图片上传成功');
				this.form.image = url;
			},
			imgRemove1() {
				this.$message('图片删除成功');
			},
		}
	};
</script>

<style scoped>
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
</style>
