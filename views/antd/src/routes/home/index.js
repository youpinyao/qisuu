import React from 'react';
import { connect } from 'dva';

import {
  Table,
  Row,
  Input,
  Col,
  message,
  Select,
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
        fileSize,
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

    const doSearch = (e, key) => {
      dispatch({
        type: 'home/updateState',
        payload: {
          [key]: e.target ? e.target.value : e,
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
          <Col span={12}>
            <Input defaultValue={searchKey} placeholder="请输入搜索关键字" onPressEnter={e => doSearch(e, 'searchKey')} />
          </Col>
          <Col offset={1} span={11}>
            <Select onChange={e => doSearch(e, 'fileSize')} style={{ width: '100%' }} placeholder="文件大小" value={fileSize}>
              <Select.Option value={0}>0M</Select.Option>
              <Select.Option value={5}>5M</Select.Option>
              <Select.Option value={10}>10M</Select.Option>
            </Select>
          </Col>
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
