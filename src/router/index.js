import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/home',
			name: 'home',
			component: resolve => require(['../components/common/Home.vue'], resolve),
			redirect: '/home/appraisal',
			meta: {
				title: '首页'
			},
			children: [{
					path: '/home/statistics',
					name: 'statistics',
					component: resolve => require(['../components/page/statistics/statistics.vue'], resolve),
					meta: {
						title: '数据统计',
						permission: true,
						index: 'statistics'
					}
				},
				{
					path: '/home/feedback',
					name: 'feedback',
					component: resolve => require(['../components/page/feedback/feedback.vue'], resolve),
					meta: {
						title: '客户反馈',
						permission: true,
						index: 'feedback'
					}
				},
				{
					path: '/home/task',
					name: 'task',
					component: resolve => require(['../components/page/statistics/task.vue'], resolve),
					meta: {
						title: '今日任务',
						permission: true,
						index: 'task'
					}
				},
				{
					path: '/home/analyze',
					name: 'analyze',
					component: resolve => require(['../components/page/statistics/analyze.vue'], resolve),
					meta: {
						title: '数据分析',
						permission: true,
						index: 'analyze'
					}
				},

				{
					path: '/home/team',
					name: 'team',
					component: resolve => require(['../components/page/team/team.vue'], resolve),
					meta: {
						title: '项目团队',
						permission: true,
						index: 'team'
					}
				},
				{
					path: '/home/project',
					name: 'project',
					component: resolve => require(['../components/page/project/project.vue'], resolve),
					meta: {
						title: '项目列表',
						permission: true,
						index: 'project'
					}
				},
				{
					path: '/home/:id',
					name: 'proinfo',
					component: resolve => require(['../components/page/project/proinfo.vue'], resolve),
					meta: {
						title: '项目详情',
						index: 'proinfo'
					}
				},
				{
					path: '/home/servetype',
					name: 'servetype',
					component: resolve => require(['../components/page/serve/servetype.vue'], resolve),
					meta: {
						title: '服务类型',
						permission: true,
						index: 'servetype'
					}
				},
				{
					path: '/home/serveinfo',
					name: 'serveinfo',
					component: resolve => require(['../components/page/serve/serveinfo.vue'], resolve),
					meta: {
						title: '服务详情',
						permission: true,
						index: 'serveinfo'
					}
				},
				{
					path: '/home/client',
					name: 'client',
					component: resolve => require(['../components/page/serve/client.vue'], resolve),
					meta: {
						title: '客户成功',
						permission: true,
						index: 'client'
					}
				},
				{
					path: '/home/politics',
					name: 'politics',
					component: resolve => require(['../components/page/information/politics.vue'], resolve),
					meta: {
						title: '政策解读',
						permission: true,
						index: 'politics'
					}
				},
				{
					path: '/home/information',
					name: 'information',
					component: resolve => require(['../components/page/information/information.vue'], resolve),
					meta: {
						title: '行业资讯',
						permission: true,
						index: 'information'
					}
				},
				{
					path: '/home/banner',
					name: 'banner',
					component: resolve => require(['../components/page/banner/banner.vue'], resolve),
					meta: {
						title: 'Banner列表',
						permission: true,
						index: 'banner'
					}
				},
				{
					path: '/home/admin',
					name: 'admin',
					component: resolve => require(['../components/page/sys/admin.vue'], resolve),
					meta: {
						title: '管理员设置',
						permission: true,
						index: 'admin'
					}
				},
				{
					path: '/home/zhongjing',
					name: 'zhongjing',
					component: resolve => require(['../components/page/sys/zhongjing.vue'], resolve),
					meta: {
						title: '关于中竞',
						permission: true,
						index: 'zhongjing'
					}
				},
				{
					path: '/home/role',
					name: 'role',
					component: resolve => require(['../components/page/sys/role.vue'], resolve),
					meta: {
						title: '角色设置',
						permission: true,
						index: 'role'
					}
				},
				{
					path: '/home/keyvalue',
					name: 'keyvalue',
					component: resolve => require(['../components/page/sys/keyvalue.vue'], resolve),
					meta: {
						title: '其他设置',
						permission: true,
						index: 'keyvalue'
					}
				},
				{
					path: '/home/templatetype',
					name: 'templatetype',
					component: resolve => require(['../components/page/template/templatetype.vue'], resolve),
					meta: {
						title: '模板分类',
						permission: true,
						index: 'templatetype'
					}
				},
				{
					path: '/home/template',
					name: 'template',
					component: resolve => require(['../components/page/template/template.vue'], resolve),
					meta: {
						title: '模板配置',
						permission: true,
						index: 'template'
					}
				},
				{
					path: '/home/organization',
					name: 'organization',
					component: resolve => require(['../components/page/user/organization.vue'], resolve),
					meta: {
						title: '客户列表',
						permission: true,
						index: 'organization'
					}
				},
				{
					path: '/home/user',
					name: 'user',
					component: resolve => require(['../components/page/user/user.vue'], resolve),
					meta: {
						title: '用户列表',
						permission: true,
						index: 'user'
					}
				},{
					path: '/home/projecttemplate',
					name: 'projecttemplate',
					component: resolve => require(['../components/page/template/projecttemplate.vue'], resolve),
					meta: {
						title: '项目模板',
						permission: true,
						index: 'projecttemplate'
					}
				},
			]
		},
		{
			path: '/login',
			component: resolve => require(['../components/page/Login.vue'], resolve)
		},
		{
			path: '*',
			redirect: '/home/404'
		}
	]
})
