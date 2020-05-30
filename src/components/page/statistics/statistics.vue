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
						<el-row :key="menuKey" v-html="forEachData">

						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<!-- Echarts -->
		<el-row>
			<el-col :span="24">
				<el-card class="box-card" shadow="hover" style="width: 100%;">
					<div slot="header" class="clearfix">
						<span>项目分析</span>
					</div>
					<div id="analysisChart" style="width: 100%;height:400px;"></div>
				</el-card>
			</el-col>
			<el-col :span="24">
				<el-card class="box-card" shadow="hover" style="width: 100%;">
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
				indexs: '',

				menuKey: 0,
				tableData: [],
				nowTime: '',
				forEachData: '',
				testData: {},
				
				
				analysis:[],
				analysisName:[],
				analysisData:[],
				
				
				itemAnalysis:[],
				itemAnalysisName:[],
				itemAnalysisData:[],
			}
		},

		mounted() {
			this.insertAllHTMLCode();
			this.getAnalysisData();
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
			getAnalysisData(){
				this.$axios
					.post('/dataStats/salesAnalysis', {})
					.then(res => {
						if(!res.success)
							this.$message.error("加载数据失败");
						this.analysis = res.data;
						
						this.analysisName = Object.keys(res.data);
						this.analysisName.splice(-1,1);
						
						this.analysisData = Object.values(res.data);
						this.analysisData.splice(-1,1);
						
						this.gatItemAnalysisData();
						
						this.drowsellChart();
					});
			},
			
			gatItemAnalysisData(){
				this.$axios
					.post('/dataStats/itemAnalysis', {})
					.then(res => {
						if(!res.success)
							this.$message.error("加载数据失败");
						this.itemAnalysis = res.data;
						
						this.itemAnalysisName = Object.keys(res.data);
						
						this.itemAnalysisData = Object.values(res.data);
						this.drawLine();
					});
			},
			//获取现在的时间
			getNowTime() {
				this.nowTime = new Date().format("yyyy年MM月dd日 hh:mm:ss");
			},
			//mounted后在用Echarts在card里画线
			drawLine() {
				let analysisChart = this.$echarts.init(document.getElementById('analysisChart'));
				
				// 绘制图表
				analysisChart.setOption({
					title: {
						text: new Date().format("yyyy")
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: this.itemAnalysisName
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
						data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: this.itemAnalysisName[0],
							type: 'line',
							data: this.itemAnalysisData[0]
						},
						{
							name: this.itemAnalysisName[1],
							type: 'line',
							data: this.itemAnalysisData[1]
						},
						{
							name: this.itemAnalysisName[2],
							type: 'line',
							data: this.itemAnalysisData[2]
						},
					]
				});
			},
			
			drowsellChart(){
				let sellChart = this.$echarts.init(document.getElementById('sellChart'));
				sellChart.setOption({
					title: {
						text: new Date().format("yyyy")
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
						data: this.analysisName
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
						data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
					}],
					yAxis: {
						type: 'value'
					},
					series: [{
							name: this.analysisName[0],
							type: 'line',
							areaStyle: {},
							data: this.analysisData[0]
						},
						{
							name: this.analysisName[1],
							type: 'line',
							areaStyle: {},
							data: this.analysisData[1]
						},
						{
							name: this.analysisName[2],
							type: 'line',
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							areaStyle: {},
							data: this.analysisData[2]
						}
					]
				});
			},
			/* getData() {
				this.loading = true;
				this.$axios
					.post('/dataStats/dataStatsAll', {})
					.then(res => {
						
						this.tableData = res.data;
					});
				this.loading = false;
			}, */

			//循环遍历数据后进行汉化
			insertAllHTMLCode() {
				this.loading = true;
				this.$axios
					.post('/dataStats/dataStatsAll', {})
					.then(res => {
						this.tableData = res.data;
						let arr = Object.entries(this.tableData);
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
					});
				this.loading = false;
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
