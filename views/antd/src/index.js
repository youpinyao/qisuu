
import 'babel-polyfill';
import 'meetyou-antd-base/src/less/theme.less';
import 'less/global.less';

import dva from 'dva';
import createLoading from 'dva-loading';
import browserHistory from 'dva/router';

// mock
console.log('env', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  require('../mock');
}

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError: (data) => {
    console.error('error', data);
  },
});

// 2. Model
app.model(require('./models/app'));

// 3. Router
app.router(require('./router'));

// 4. Start
app.start('#root');
