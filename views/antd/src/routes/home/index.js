import React from 'react';
import { connect } from 'dva';

import {
  Table,
  Row,
  Input,
  message,
} from 'antd';

import columns from './columns';

// eslint-disable-next-line
import styles from './index.less';

class Home extends React.Component {
  render() {
    const {
      dispatch,
      loading,
      home: {
        tableData,
        pagination,
        searchKey,
        push_mail,
      },
    } = this.props;

    const onChange = (pag) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          pagination: pag,
        },
      });
      dispatch({
        type: 'home/queryTable',
      });
    };

    const doSearch = (e) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          searchKey: e.target.value,
          pagination: {
            ...pagination,
            current: 1,
          },
        },
      });
      dispatch({
        type: 'home/queryTable',
      });
    };
    const updatePushMail = (e) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          push_mail: e.target.value,
        },
      });
    };
    const setCurrentRow = (record) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          current_row: record,
        },
      });
    };
    const onConfirmPushMailTxt = () => {
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(push_mail)) {
        message.error('请输入正确邮箱地址');
        return false;
      }
      dispatch({
        type: 'home/pushToKindleTxt',
      });
    };

    const onConfirmPushMailMobi = () => {
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(push_mail)) {
        message.error('请输入正确邮箱地址');
        return false;
      }
      dispatch({
        type: 'home/pushToKindleMobi',
      });
    };
    return (
      <Row>
        <Row
          style={{
            padding: 15,
          }}
        >
          <Input defaultValue={searchKey} placeholder="请输入搜索关键字" onPressEnter={doSearch} />
        </Row>
        <Row>
          <Table
            columns={columns({
              loading,
              push_mail,
              updatePushMail,
              onConfirmPushMailTxt,
              onConfirmPushMailMobi,
              setCurrentRow,
            })}
            onChange={onChange}
            dataSource={tableData}
            pagination={pagination}
            rowKey={record => record.page_url}
            loading={loading.effects['home/queryTable']}
          />
        </Row>
      </Row>
    );
  }
}

export default connect(({ home, loading }) => ({
  home,
  loading,
}))(Home);
