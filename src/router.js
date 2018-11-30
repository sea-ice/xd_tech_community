import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/Index';
import PostDetail from './routes/Post/PostDetail'
import AuthorDetail from './routes/User/AuthorDetail'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/author/:id" exact component={AuthorDetail} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
