import React from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
// eslint-disable-next-line
import styles from './app.less';

class App extends React.Component {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));
