import $ from 'jquery';
import { message } from 'antd';

let isLoginTimeout = false;

export function get(url, data, opt) {
  const options = {
    ...(opt || {}),
    method: 'GET',
    url: window.location.port === 3000 ? url : `${window.location.origin.split(':')[0]}:${window.location.origin.split(':')[1]}:3000${url}`,
    data,
  };

  return request(options);
}

export function post(url, data, opt) {
  const options = {
    ...opt,
    method: 'POST',
    url: window.location.port === 3000 ? url : `${window.location.origin.split(':')[0]}:${window.location.origin.split(':')[1]}:3000${url}`,
    data: JSON.stringify(data || {}),
  };

  return request(options);
}

function request(opt) {
  const options = {
    timeout: 30000,
    cache: false,
    errorTip: true,
    dataType: 'JSON',
    headers: {
      'Content-Type': '',
    },
    ...opt,
  };

  return new Promise((resolve, reject) => {
    $.ajax(options).then(
      (data) => {
        resolve(data);
      },
      (data) => {
        // 未登录，跳到登录页面
        if (data.status === 403) {
          if (!isLoginTimeout) {
            isLoginTimeout = true;
            message.error(data.responseJSON.message);
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
        } else if (data.status === 200) {
          message.error('接口错误，请查看控制台');
          console.log('====================================');
          console.log(data.responseText);
          console.log('====================================');
        } else if (options.errorTip) {
          if (data.status === 400) {
            message.error(data.responseJSON.message || '未知错误');
          } else if (data.status === 404) {
            message.error('接口不存在');
          }
        }
        reject(data.responseJSON || {
          error_code: '',
          message: '接口错误，请查看控制台',
        });
      },
    );
  });
}
