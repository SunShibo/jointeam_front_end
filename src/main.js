import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from '@/config/axios';
import ElementUI from 'element-ui';
import store from './store/index';
import echarts from 'echarts'
import VueDND from 'awe-dnd'
import BaiduMap from 'vue-baidu-map'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.use(BaiduMap, {
    ak: '94MwwvXZHzcdz0cwKvAiboDlhEyLU2c9'
})
Vue.use(VueDND)
Vue.config.productionTip = false;

Vue.use(ElementUI, {
    size: 'small'
});


//全局过滤器
Vue.filter('FormatTime', val => {
    if (!val) return '无';
    const date = new Date(val.time);
    const year = date.getFullYear();
    const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
});

//全局过滤器
Vue.filter('FormatDateTime', val => {
    if (!val) return '无';
    const date = new Date(val.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
});


//格式化日期  格式 yyyy-MM-dd
let formatDate = (row, column) => {
    if (!row.createTime)return '无';
    const date = new Date(row.createTime.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};

//格式化日期  格式 yyyy-MM-dd
let formatDateCommon = (row, column) => {
    if (!row)return '无';
    const date = new Date(row),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}/${month}/${day}`;
};

//格式化日期  格式 yyyy-MM-dd hh:mm:ss
let formatTime = (row, column) => {
    if (!row.creationDate)return '无';
    const date = new Date(row.creationDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
};

//格式化日期  格式 yyyy-MM-dd
let effectiveDate = (row, column) => {
    if (!row.effectiveDate)return '无';
    const date = new Date(row.effectiveDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};

//格式化日期  格式 yyyy-MM-dd
let formatReleaseDate = (row, column) => {
    if (!row.releaseDate)return '无';
    const date = new Date(row.releaseDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};

//格式化日期  格式 yyyy/MM/dd hh:mm:ss
let formatDateTime = (row) => {
    if (!row)return '无';
    const date = new Date(row),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}/${month}/${day} ${hh}:${mm}:${ss}`;
};


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = parseInt(sessionStorage.getItem('ms_uid'));
    const menu = JSON.parse(sessionStorage.getItem('me_u'));
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        //标识用于判断是否权限是否存在
        let flag = false;
        //判断是否是刷新页面
        if (Object.is(from.path, to.path)) {
            flag = true;
        } else {
            //遍历菜单
            for (let i = 0, len = menu.length; i < len; i++) {
                let item = menu[i].ch;
                //通过is方法判断两个字符串是否相等
                if (Object.is(to.meta.index, menu[i].index)) {
                    flag = true;//改变标识
                    break;
                } else if (item.length) {//判断是否有二级菜单
                    for (let j = 0, len_j = item.length; j < len_j; j++) {
                        if (Object.is(item[j].index, to.meta.index)) {
                            flag = true;
                            break;
                        }
                    }
                }
            }
        }
        flag ? next() : next('/home/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }

})

Vue.prototype.$axios = axios;
Vue.prototype.formatDate = formatDate;
Vue.prototype.effectiveDate = effectiveDate;
Vue.prototype.formatReleaseDate = formatReleaseDate;
Vue.prototype.formatDateTime = formatDateTime;
Vue.prototype.formatTime = formatTime;
Vue.prototype.formatDateCommon = formatDateCommon;
Vue.prototype.closeOnClickModal = false;
Vue.prototype.$echarts = echarts;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
