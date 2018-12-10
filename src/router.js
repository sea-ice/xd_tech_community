import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import HomePage from './routes/HomePage';
import PostDetail from './routes/Post/PostDetail';
import Publish from './routes/Publish';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/publish" exact component={Publish} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
