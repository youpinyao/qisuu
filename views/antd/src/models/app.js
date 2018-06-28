
export default {
  namespace: 'app',
  state: {

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
