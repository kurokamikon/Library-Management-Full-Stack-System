import axios from 'axios';
const pendingMap = new Map();

const LoadingInstance = {
  _target: null,
  _count: 0
};

function getTokenAUTH() {
  return '5555555555';
}

function removePending(config) {
  // 在这里添加移除 pending 请求的逻辑
}

function addPending(config) {
  // 在这里添加添加 pending 请求的逻辑
}

function httpErrorStatusHandle(error) {
  // 在这里添加处理 HTTP 错误的逻辑
}

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
      code_message_show: false
    },
    customOptions
  );

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
        alert('error', '请求错误', response.data.msg);
        return Promise.reject(response.data);
      }

      return custom_options.restore_data_format ? response.data : response;
    },
    (error) => {
      error.config && removePending(error.config);
      custom_options.loading && closeLoading(custom_options);
      custom_options.error_message_show && httpErrorStatusHandle(error);
      return Promise.reject(error);
    }
  );

  return service(axiosConfig);
}

export default {
  install(app) {
    app.config.globalProperties.$axios = Axios;
  }
};
