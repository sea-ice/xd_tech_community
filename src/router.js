import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic'

function appRoutes({ app, history }) {
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
  const ResetPasswordPage = dynamic({
    app,
    component: () => import('./routes/User/ResetPassword')
  })
  const PostDetail = dynamic({
    app,
    component: () => import('./routes/Post/PostDetail')
  })
  const Notification = dynamic({
    app,
    component: () => import('./routes/User/Notification')
  })
  const AuthorDetail = dynamic({
    app,
    component: () => import('./routes/User/AuthorDetail')
  })
  const EditDraft = dynamic({
    app,
    component: () => import('./routes/Post/EditDraft')
  })
  const SearchPage = dynamic({
    app,
    component: () => import('./routes/Search')
  })
  const Error404 = dynamic({
    app,
    component: () => import('./routes/Extra/404')
  })
  const Error500 = dynamic({
    app,
    component: () => import('./routes/Extra/500')
  })
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/reset_password" exact component={ResetPasswordPage} />
        <Route path="/notify" exact component={Notification} />
        <Route path="/search" exact component={SearchPage} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/author/:id" exact component={AuthorDetail} />
        <Route path="/edit/:id" exact component={EditDraft} />
        <Route path="/404" exact component={Error404} />
        <Route path="/500" exact component={Error500} />
      </Switch>
    </Router>
  )
}

export default appRoutes;
