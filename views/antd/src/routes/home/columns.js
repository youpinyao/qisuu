import React from 'react';
import {
  Button,
  Input,
  Popconfirm,
} from 'antd';

import styles from './index.less';


export default ({
  loading,
  push_mail,
  updatePushMail,
  onConfirmPushMailTxt,
  onConfirmPushMailMobi,
  setCurrentRow,
}) => {
  return [{
    title: '标题',
    dataIndex: 'title',
  }, {
    title: '作者',
    dataIndex: 'author',
  }, {
    title: '大小',
    dataIndex: 'size',
  }, {
    title: '时间',
    dataIndex: 'date',
  }, {
    title: '页面地址',
    dataIndex: 'page_url',
    render(text) {
      return (
        <a href={text} target="_blank">{text}</a>
      );
    },
  }, {
    title: '下载地址',
    dataIndex: 'download_url',
    render(text) {
      return (
        <a href={text} target="_blank">{text}</a>
      );
    },
  }, {
    title: '最新章节',
    dataIndex: 'chapter_text',
    render(text, record) {
      return (
        <a href={record.chapter}>{record.chapter_text}</a>
      );
    },
  }, {
    title: '操作',
    render(record) {
      return (
        <div
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          <Popconfirm
            overlayClassName={styles.popConfirm}
            title={(
              <Input placeholder="请输入 kindle 邮箱地址" onChange={updatePushMail} value={push_mail} />
            )}
            onConfirm={onConfirmPushMailTxt}
          >
            <Button loading={loading.effects['home/pushToKindleTxt']} onClick={() => setCurrentRow(record)}>推送txt到kindle</Button>
          </Popconfirm>

          {/* <Popconfirm
            overlayClassName={styles.popConfirm}
            title={(
              <Input placeholder="请输入 kindle 邮箱地址" onChange={updatePushMail} value={push_mail} />
            )}
            onConfirm={onConfirmPushMailMobi}
          >
            <Button className="ml-10" loading={loading.effects['home/pushToKindleMobi']} onClick={() => setCurrentRow(record)}>推送mobi到kindle</Button>
          </Popconfirm> */}
        </div>
      );
    },
  }];
};
