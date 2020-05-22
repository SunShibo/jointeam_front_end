import {
    baseURL, //引入baseUrl
} from "../config/env";
import {Message} from 'element-ui';
import axios from 'axios';
import qs from 'qs';
import store from '../src/store/index';

// 创建 axios 实例
let service = axios.create({
    baseURL: baseURL,
    timeout: 20000,  // 请求超时时间
    crossDomain: true,//设置cross跨域
    withCredentials: true//设置cross跨域 并设置访问权限 允许跨域携带cookie信息
})

// 设置 post 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        //判断请求方式是否为POST，进行转换格式
        console.log(config.data)
        config.method === 'post'
            ? config.data = qs.stringify({...config.data})
            : config.params = {...config.params};
        // 请求发送前进行处理
        return config
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        store.commit('CLOSE_LOADING');
        if (response.data.success) {
            let {data} = response;
            return data;
        } else {
            Message.error(`错误码：${response.data.code} 错误信息：${response.data.msg}`);
            return {};
        }
    },
    (error) => {
        store.commit('CLOSE_LOADING');
        let info = {},
            {status, statusText, data} = error.response;
        //response为空时
        if (!error.response) {
            Message.error("response为空,5000:" + 'Network Error');
        } else {
            //报错
            Message.error(status + ":" + statusText);
        }
    }
)


/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default service