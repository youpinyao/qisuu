import * as request from 'request';
import * as urls from 'urls';

import {
  message,
} from 'antd';

export default {
  namespace: 'home',
  state: {
    tableData: [],
    searchKey: '',
    // push_mail: '',
    push_mail: '8618650808852@kindle.cn',
    // push_mail: '497400448@qq.com',
    current_row: null,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'init',
      });
    },
  },
  effects: {
    // eslint-disable-next-line
    *init({ payload }, { put }) {
      yield put({
        type: 'queryTable',
      });
    },
    *queryTable({ payload }, { put, select, call }) {
      const {
        searchKey,
        pagination,
      } = yield select(({ home }) => home);
      const data = yield call(request.get, urls.list, {
        searchKey,
        ...pagination,
      });

      yield put({
        type: 'updateState',
        payload: {
          tableData: data.content,
          pagination: {
            ...pagination,
            total: data.total,
          },
        },
      });
    },
    *pushToKindleTxt({ payload }, { call, select }) {
      const {
        current_row,
        push_mail,
      } = yield select(({ home }) => home);
      yield call(request.post, urls.pushToKindleTxt, {
        ...current_row,
        mail: push_mail,
      });

      yield message.success(`推送${current_row.title} txt至 ${push_mail} 成功`);
    },
    *pushToKindleMobi({ payload }, { call, select }) {
      const {
        current_row,
        push_mail,
      } = yield select(({ home }) => home);
      yield call(request.post, urls.pushToKindleMobi, {
        ...current_row,
        mail: push_mail,
      });

      yield message.success(`推送${current_row.title} mobi至 ${push_mail} 成功`);
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
