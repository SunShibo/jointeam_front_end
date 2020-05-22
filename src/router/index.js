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
/* 			children: [{
				path: '/home/statistics',
				name: 'statistics',
				component: resolve => require(['../components/page/system/statistics.vue'], resolve),
				meta: {
					title: '数据统计',
					permission: true,
					index: 'statistics'
				}
			},
				{
					path: '/home/admin',
					name: 'admin',
					component: resolve => require(['../components/page/system/admin.vue'], resolve),
					meta: {
						title: '管理员设置',
						permission: true,
						index: 'admin'
					}
				},
				{
					path: '/home/role',
					name: 'role',
					component: resolve => require(['../components/page/system/role.vue'], resolve),
					meta: {
						title: '角色设置',
						permission: true,
						index: 'role'
					}
				},
				{
					path: '/home/user',
					name: 'user',
					component: resolve => require(['../components/page/user/user.vue'], resolve),
					meta: {
						title: '用户管理',
						permission: true,
						index: 'user'
					}
				},
				{
					path: '/home/course',
					name: 'course',
					component: resolve => require(['../components/page/course/course.vue'], resolve),
					meta: {
						title: '课程列表',
						permission: true,
						index: 'course'
					}
				},
				{
					path: '/home/order',
					name: 'order',
					component: resolve => require(['../components/page/order/order.vue'], resolve),
					meta: {
						title: '订单列表',
						permission: true,
						index: 'order'
					}
				},
				{
					path: '/home/close',
					name: 'close',
					component: resolve => require(['../components/page/order/close.vue'], resolve),
					meta: {
						title: '结算订单',
						permission: true,
						index: 'close'
					}
				},


				{
					path: '/home/coach',
					name: 'coach',
					component: resolve => require(['../components/page/coach/coach.vue'], resolve),
					meta: {
						title: '教练列表',
						permission: true,
						index: 'coach'
					}
				},
				{
					path: '/home/feedback',
					name: 'feedback',
					component: resolve => require(['../components/page/system/feedback.vue'], resolve),
					meta: {
						title: '反馈列表',
						permission: true,
						index: 'feedback'
					}
				},
				{
					path: '/home/coordinate',
					name: 'coordinate',
					component: resolve => require(['../components/page/config/site.vue'], resolve),
					meta: {
						title: '坐标配置',
						permission: true,
						index: 'coordinate'
					}
				},
				{
					path: '/home/dictionaries',
					name: 'dictionaries',
					component: resolve => require(['../components/page/config/dictionaries.vue'], resolve),
					meta: {
						title: '字典配置',
						permission: true,
						index: 'dictionaries'
					}
				},
				{
					path: '/home/param',
					name: 'param',
					component: resolve => require(['../components/page/config/param.vue'], resolve),
					meta: {
						title: '参数配置',
						permission: true,
						index: 'param'
					}
				},
			] */
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
