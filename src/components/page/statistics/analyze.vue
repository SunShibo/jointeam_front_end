<template>
	<div>
		<el-row>
			<el-col>
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>数据分析 / 数据更新时间 : {{nowTime}}</span>
					</div>
					<el-row>
						<el-col :span="12">
							<el-card class="box-card" shadow="hover">
								<div slot="header" class="clearfix">
									<span>任务分析</span>
								</div>
								<div id="analysisChart" style="width: 100%;height:400px;"></div>
							</el-card>
						</el-col>

						<el-col :span="12">
							<el-card class="box-card" shadow="hover">
								<div slot="header" class="clearfix">
									<span>项目分析</span>
								</div>
								<div id="sellChart" style="width: 100%;height:400px;"></div>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<!-- Echarts -->

	</div>
</template>
<script>
	import statistics from '../../../utils/statisticsUtil.js';
	import echarts from '../../../utils/echarts.min.js';

	export default {
		name: 'statistics',
		data() {
			return {
				nowTime: '',
				forEachData: '',

				salesAnalysisCount: [],
				salesAnalysisCountName: [],
				salesAnalysisCountData: [],
				
				taskCountList:[],
				taskCountListName:[],
				taskCountListData:[],
			}
		},
		mounted() {
			this.getData();
		},
		created() {
			this.getNowTime();
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
			//mounted后在用Echarts在card里画线
			drawLine() {
				let analysisChart = this.$echarts.init(document.getElementById('analysisChart'));
				let sellChart = this.$echarts.init(document.getElementById('sellChart'));
				// 绘制图表

				var colors = ['#5793f3', '#d14a61', '#675bba'];
				analysisChart.setOption({
					color: colors,

					title: {
						text: '近六年任务分析'
					},
					tooltip: {
						trigger: 'none',
						axisPointer: {
							type: 'cross'
						}
					},
					legend: {
						data: ['近六年任务分析']
					},
					grid: {
						top: 70,
						bottom: 50
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						axisLine: {
							onZero: false,
							lineStyle: {
								color: colors[0]
							}
						},
						axisPointer: {
							label: {
								formatter: function(params) {
									return '任务数量  ' + params.value +
										(params.seriesData.length ? '：' + params.seriesData[0].data : '');
								}
							}
						},
						data: this.taskCountListName
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '任务数',
						type: 'line',
						xAxisIndex: 0,
						smooth: true,
						data: this.taskCountListData
					}]
				});
				sellChart.setOption({
					title: {
						text: '最近六年项目数量'
					},
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: this.salesAnalysisCountName,
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '项目数量',
						type: 'bar',
						barWidth: '60%',
						data: this.salesAnalysisCountData
					}]
				});
			},
			getData() {
				this.$axios
					.post('/dataStats/salesAnalysisCount', {})
					.then(res => {
						if (!res.success)
							this.$message.error("加载数据失败");
						this.salesAnalysisCount = res.data;
						this.salesAnalysisCountName = Object.keys(res.data);
						this.salesAnalysisCountData = Object.values(res.data);
						this.$axios
							.post('/dataStats/salesAnalysisInfoCount', {})
							.then(res => {
								if (!res.success)
									this.$message.error("加载数据失败");
								this.taskCountList = res.data;
								this.taskCountListName = Object.keys(res.data);
								this.taskCountListData = Object.values(res.data);
								this.drawLine();
							});
						this.drawLine();
					});
			}
		}
	}
</script>

<style>
	/* .el-row {
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
	} */
</style>
