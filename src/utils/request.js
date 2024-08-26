import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import router from '@/router/index.js';

const pendingMap = new Map();
const LoadingInstance = {
  _target: null,
  _count: 0
};

function getTokenAUTH() {
  return sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null;
}

function removePending(config) {
  const url = [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');
  if (pendingMap.has(url)) {
    const cancel = pendingMap.get(url);
    cancel(url);
    pendingMap.delete(url);
  }
}

function addPending(config) {
  const url = [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(url)) {
        pendingMap.set(url, cancel);
      }
    });
}

function httpErrorStatusHandle(error) {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break;
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network')) message = '网络异常，请检查您的网络！';

  console.error(message);
}

function closeLoading(options) {
  if (options.loading && LoadingInstance._count > 0) LoadingInstance._count--;
  if (LoadingInstance._count === 0) {
    LoadingInstance._target && LoadingInstance._target.close();
    LoadingInstance._target = null;
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (!inThrottle) {
        func(...args)
          .then(resolve)
          .catch(reject);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      } else {
        resolve({ throttled: true });
      }
    });
  };
}

const throttledRequests = new Map();

function Axios(axiosConfig, customOptions = {}, loadingOptions = {}) {
  const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 60,
    responseType: 'json'
  });

  const custom_options = Object.assign(
    {
      repeat_request_cancel: true,
      loading: false,
      restore_data_format: true,
      error_message_show: true,
      code_message_show: false,
      throttle: false,
      throttleTime: 3000
    },
    customOptions
  );

  const throttledAxios = (config) => {
    const key = config.url + JSON.stringify(config.data || {});
    if (!throttledRequests.has(key)) {
      throttledRequests.set(
        key,
        throttle((config) => service(config), custom_options.throttleTime)
      );
    }
    return throttledRequests.get(key)(config);
  };

  service.interceptors.request.use(
    (config) => {
      removePending(config);
      custom_options.repeat_request_cancel && addPending(config);

      if (custom_options.loading) {
        LoadingInstance._count++;
        if (LoadingInstance._count === 1) {
          LoadingInstance._target = useToast();
        }
      }

      if (getTokenAUTH() && typeof window !== 'undefined') {
        config.headers.Authorization = getTokenAUTH();
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    (response) => {
      removePending(response.config);
      custom_options.loading && closeLoading(custom_options);

      if (custom_options.code_message_show && response.data && response.data.code !== 200) {
        return Promise.reject(response.data);
      }

      return custom_options.restore_data_format ? response.data : response;
    },
    (error) => {
      error.config && removePending(error.config);
      custom_options.loading && closeLoading(custom_options);
      custom_options.error_message_show && httpErrorStatusHandle(error);
      if (error.response && error.response.data.status === 401 && error.response.data.error === 'Token expired') {
        console.log('Token expired, redirecting to login page');
        sessionStorage.removeItem('user');
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );

  return custom_options.throttle ? throttledAxios(axiosConfig) : service(axiosConfig);
}

export { Axios };
export default {
  install(app) {
    app.config.globalProperties.$axios = Axios;
  }
};
