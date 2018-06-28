import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, routerRedux } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import App from './routes/app';

const { ConnectedRouter } = routerRedux;

const Routers = ({ history, app }) => {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  });
  const routes = [
    {
      path: '/home',
      models: () => [import('./models/home')],
      component: () => import('./routes/home/'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zhCN}>
        <App>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            {routes.map(({ path, ...dynamics }, key) => (
              <Route
                key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))}
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  );
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
