import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import HomePage from './routes/HomePage';
import PostDetail from './routes/Post/PostDetail'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/post/:id" exact component={PostDetail} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
