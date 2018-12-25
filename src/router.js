import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic'

import IndexPage from './routes/Index';
// import Publish from './routes/Publish';
import RegisterPage from './routes/User/Register'
import LoginPage from './routes/User/Login'
import PostDetail from './routes/Post/PostDetail'
import Notification from './routes/User/Notification'
import AuthorDetail from './routes/User/AuthorDetail'
import Error404 from './routes/Extra/404'

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
        {/* <Route path="/publish" exact component={Publish} /> */}
        <Route path="/login" exact component={LoginPage} />
        <Route path="/notify" exact component={Notification} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/author/:id" exact component={AuthorDetail} />
        <Route path="/404" exact component={Error404} />
      </Switch>
    </Router>
  )
}

export default appRouterConfig;
