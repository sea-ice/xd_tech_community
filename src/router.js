import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic'

function appRouterConfig(app) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/Index')
  })
  const RegisterPage = dynamic({
    app,
    component: () => import('./routes/User/Register')
  })
  const LoginPage = dynamic({
    app,
    component: () => import('./routes/User/Login')
  })
  const Publish = dynamic({
    app,
    component: () => import('./routes/Post/Publish')
  })
  const PostDetail = dynamic({
    app,
    component: () => import('./routes/Post/PostDetail')
  })
  const Notification = dynamic({
    app,
    component: () =>
      import ('./routes/User/Notification')
  })
  const AuthorDetail = dynamic({
    app,
    component: () =>
      import ('./routes/User/AuthorDetail')
  })
  const Error404 = dynamic({
    app,
    component: () =>
      import ('./routes/Extra/404')
  })


  return ({history}) => (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/publish" exact component={Publish} />
        <Route path="/notify" exact component={Notification} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/author/:id" exact component={AuthorDetail} />
        <Route path="/404" exact component={Error404} />
      </Switch>
    </Router>
  )
}

export default appRouterConfig;
