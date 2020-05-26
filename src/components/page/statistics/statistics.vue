<template>
	<div>
		<el-row>
			<el-col>
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>总览 / 更新时间  :  {{nowTime}}</span>
					</div>

					<!-- 信息展示框-->
					<div>
						<el-row v-html="forEachData">

						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<!-- Echarts -->
		<el-row>
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>项目分析</span>
					</div>
					<div id="analysisChart" style="width: 100%;height:400px;"></div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>销售分析</span>
					</div>
					<div id="sellChart" style="width: 100%;height:400px;"></div>
				</el-card>
			</el-col>
		</el-row>
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
				testData: {
					"payOrderNumber": 3,
					"paymentAmount": 3,
					"userNumber": 17,
					"asd": null,
					"qwe": 23,
					"g": 11,
					"xx": 12,
					"cc": 13,
				},
			}
		},
		mounted() {
			this.drawLine();
		},
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
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '邮件营销',
							type: 'line',
							stack: '总量',
							data: [120, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '联盟广告',
							type: 'line',
							stack: '总量',
							data: [220, 182, 191, 234, 290, 330, 310]
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
			//循环遍历数据后进行汉化
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

<style scoped>
	
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
