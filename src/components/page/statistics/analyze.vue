<template>
	<div>
		<el-row>
			<el-col>
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>数据分析 / 数据更新时间 : {{nowTime}}</span>
					</div>
					<el-row>
						<el-col :span="24">
							<el-card class="box-card" shadow="hover">
								<div slot="header" class="clearfix">
									<span>项目分析</span>
								</div>
								<div id="analysisChart" style="width: 100%;height:400px;"></div>
							</el-card>
						</el-col>

						<el-col :span="24">
							<el-card class="box-card" shadow="hover">
								<div slot="header" class="clearfix">
									<span>销售分析</span>
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

				testData: [120, 132, 101, 134, 90, 230, 210],

			}
		},
		mounted() {
			this.drawLine();
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
				analysisChart.setOption({
					title: {
						text: '折线图堆叠'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['项目延期', '正常进行', '已经交付']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '项目延期',
							type: 'line',
							stack: '总量',
							data: [120,0, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '正常进行',
							type: 'line',
							stack: '总量',
							data: [220,0, 182, 191, 234, 290, 330, 310]
						},
						{
							name: '已经交付',
							type: 'line',
							stack: '总量',
							data: [220,0, 182, 191, 234, 290, 330, 310]
						},
					]
				});
				sellChart.setOption({
					title: {
						text: '堆叠区域图'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					legend: {
						data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					}],
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '邮件营销',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [120, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '联盟广告',
							type: 'line',
							stack: '总量',
							areaStyle: {},
							data: [220, 182, 191, 234, 290, 330, 310]
						},
						{
							name: '搜索引擎',
							type: 'line',
							stack: '总量',
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							areaStyle: {},
							data: [820, 932, 901, 934, 1290, 1330, 1320]
						}
					]
				});
			},
		}
	}
</script>

<style>
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
