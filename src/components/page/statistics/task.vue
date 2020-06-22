<template>
	<div>
		<el-row>
			<el-col :span="12">
				<div slot="header" class="clearfix">
					<span>总览 / 更新时间 : {{nowTime}}</span>
				</div>
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span style="color: #FF0000!important;">今日待办</span>
					</div>
					
					<div v-if="taskToday == ''|| taskToday == null || taskToday == []" style="width: 100%;height:400px;text-align: left!important;overflow:auto;">
						<span>暂时没有任务</span>
					</div>

					<div v-else style="width: 100%;height:400px;text-align: left!important;overflow:auto;">
						<el-row>
							<el-col :span="15" v-for="(item,index) in taskToday" :key="index">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name">
											{{item.teamName}}
										</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">{{item.title}}</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>负责人:{{item.staffName}}</span>
									</el-button>
									<br />
									<el-tooltip class="item" effect="dark" placement="top-start">
										<div slot="content">{{item.content | sliceString}}</div>
										<span class="step-info">{{item.content | sliceStr}}</span>
									</el-tooltip>
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
					<div v-if="taskFuture == ''||taskFuture == null||taskFuture==[]" style="width: 100%;height:400px;text-align: left!important;overflow:auto;">
						<span>暂时没有任务</span>
					</div>
					<div v-else style="width: 100%;height:400px;text-align: left!important;overflow:auto;">
						<el-row>
							<el-col :span="15" v-for="(item,index) in taskFuture" :key="index">
								<div class="grid-content grid-left">
									<el-button type="text">
										<span class="firm-name">
											{{item.teamName}}
										</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span class="step">{{item.title}}</span>
										&nbsp;
										&nbsp;
										&nbsp;
										<span>负责人:{{item.staffName}}</span>
									</el-button>
									<br />
									<el-tooltip class="item" effect="dark" placement="top-start">
										<div slot="content">{{item.content | sliceString}}</div>
										<span class="step-info">{{item.content | sliceStr}}</span>
									</el-tooltip>
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
				
				taskToday: [],
				taskFuture: [],
			}
		},
		/* mounted() {}, */
		created() {
			this.getNowTime();
			this.getTodayData();
			this.getFutureData();
		},
		filters: {
			format: (date) => {
				return new Date(date).format("yyyy年MM月dd日 hh:mm:ss");
			},
			
			sliceString:(data)=>{
				
				data = data.replace(/<[^>]*>|<\/[^>]*>/gm, "");
				
				return data;
			},
			
			sliceStr: (data) => {
				var returnData = "";
				
				data = data.replace(/<[^>]*>|<\/[^>]*>/gm, "");
				
				if(data.length>12){
					returnData = data.slice(0,12);
					returnData+="...";
				}else{
					returnData = data;
				}
				return returnData;
			}
		},
		methods: {
			getTodayData(){
				this.$axios
					.post('/taskAgents/queryTaskNow', {})
					.then(res => {
						if(!res.success)
							this.$message.error("加载数据失败");
						this.taskToday = res.data;
					});
			},
			
			getFutureData(){
				this.$axios
					.post('/taskAgents/queryTaskWeek', {})
					.then(res => {
						if(!res.success)
							this.$message.error("加载数据失败");
						this.taskFuture = res.data;
					});
			},
			
			//获取现在的时间
			getNowTime() {
				this.nowTime = new Date().format("yyyy年MM月dd日 hh:mm:ss");
			},
			
		}
	}
</script>
<style>
	.firm-name {
		color: #66ccff !important;
	}

	.step {
		color: #ff3441 !important;
	}

	.step-info {
		font-size: 17px !important;
		text-align: left;

	}

	.grid-left {
		text-align: left !important;
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
		border-radius: 4px;
		min-height: 36px;
		padding-top: 20px;
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
