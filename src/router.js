import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic'

import IndexPage from './routes/Index';
import RegisterPage from './routes/User/Register'
import LoginPage from './routes/User/Login'
import PostDetail from './routes/Post/PostDetail'
import AuthorDetail from './routes/User/AuthorDetail'

function appRouterConfig(app) {
  // const IndexPage = dynamic({
  //   app,
  //   component: () => import('./routes/Index')
  // })
  // const RegisterPage = dynamic({
  //   app,
  //   component: () => import('./routes/User/Register')
  // })
  // const LoginPage = dynamic({
  //   app,
  //   component: () => import('./routes/User/Login')
  // })
  // const PostDetail = dynamic({
  //   app,
  //   component: () => import('./routes/Post/PostDetail')
  // })
  // const AuthorDetail = dynamic({
  //   app,
  //   component: () => import('./routes/User/AuthorDetail')
  // })
  return ({history}) => (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/author/:id" exact component={AuthorDetail} />
      </Switch>
    </Router>
  )
}

export default appRouterConfig;
