<template>
	<div>
		<el-row>
			<el-col>
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>总览 / 更新时间 : {{nowTime}}</span>
					</div>

					<!-- 信息展示框-->
					<div>
						<el-row v-html="forEachData">

						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span style="color: #FF0000!important;">今日待办</span>
					</div>

					<div style="width: 100%;height:400px;text-align: left!important;">
						<el-row>
							<el-col :span="12">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span style="color: #5555ff!important;">七日待办</span>
					</div>
					<div style="width: 100%;height:400px;text-align: left!important;">
						<el-row>
							<el-col :span="24">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>n Days Later</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="24">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>n Days Later</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="24">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>n Days Later</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
							<el-col :span="24">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name"><京东方科技有限公司></span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">等待现场安装</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>n Days Later</span>
									</el-button>
									<br />
									<span class="step-info">现场施工，安装5台空气压缩机</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import statistics from '../../../utils/statisticsUtil.js';

	export default {
		name: 'task',
		data() {
			return {
				nowTime: '',
				forEachData: '',
				testDate: "",
				testData: {
					"payOrderNumber": 3,
					"paymentAmount": 3,
					"userNumber": 17,
				},
			}
		},
		/* mounted() {}, */
		created() {
			this.getNowTime();
			this.insertAllHTMLCode();
		},
		filters: {
			format: (date) => {
				return new Date(date).format("yyyy年MM月dd日 hh:mm:ss");
			}
		},
		methods: {
			//获取现在的时间
			getNowTime() {
				this.nowTime = new Date().format("yyyy年MM月dd日 hh:mm:ss");
			},
			//遍历插入信息展示
			insertAllHTMLCode() {
				let arr = Object.entries(this.testData);

				var i = "".getCName(arr);

				i.forEach((item, index, value) => {
					this.forEachData += '<div data-v-8b9d66c2 class="el-col el-col-4" style="padding-right: 12px;padding-top:12px">';
					this.forEachData += '<div data-v-8b9d66c2 class="grid-content bg-purple-light">';
					this.forEachData += '<span data-v-8b9d66c2 class="smallFont">' + item[0] + '</span>';
					this.forEachData += "<br data-v-8b9d66c2 />";
					if (item[1] == null || item[1] == "null") {
						this.forEachData += '<span data-v-8b9d66c2 class="hugeFont">暂无数据</span>';
					} else {
						this.forEachData += '<span data-v-8b9d66c2 class="hugeFont">' + item[1] + '</span>';
					}
					this.forEachData += '</div data-v-8b9d66c2>';
					this.forEachData += '</div data-v-8b9d66c2>';
				});
			},
		}
	}
</script>
<style>
	.firm-name{
		 color: #66ccff!important;
	}
	
	.step{
		color: #ff3441!important;
	}
	
	.step-info{
		font-size: 17px!important;
		text-align: left;
		
	}
	.grid-left{
		text-align: left!important;
	}
	
	
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.grid-content {
		text-align: center;
		height: 60px;
		border-radius: 4px;
		min-height: 36px;
		padding-top: 20px;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.smallFont {
		font-size: 12px;
	}

	.hugeFont {
		font-size: 20px;
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
</style>
