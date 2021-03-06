import dva from 'dva';
import createHistory from 'history/createBrowserHistory'

import initialState from './initialState'
import appRoutes from './router'
import { initRootFontSize } from './utils/dom'


import './index.css';

initRootFontSize()
startApp()

function startApp() {
  // 1. Initialize
  const app = dva({
    initialState,
    history: createHistory({
      basename: process.env.NODE_ENV === 'development' ? '' : '/tech_community',
      forceRefresh: !('pushState' in window.history)// 仅在浏览器不支持HTML5 History API时启用强制刷新
    })
  });

  // 2. Plugins
  // app.use({});

  // 3. Model
  app.model(require('./models/Post/recommendPosts').default);
  app.model(require('./models/Post/indexStickPosts').default);
  app.model(require('./models/Post/postFilterState').default);
  app.model(require('./models/Post/curd').default);
  app.model(require('./models/Post/postDetails').default);
  app.model(require('./models/Post/comment').default);
  app.model(require('./models/User/msgs').default);
  app.model(require('./models/User/privateMsgs').default);
  app.model(require('./models/User/userMsgs').default);
  app.model(require('./models/User/sysMsgs').default);
  app.model(require('./models/User/author').default);
  app.model(require('./models/User/behaviors').default);
  app.model(require('./models/User/collection').default);
  app.model(require('./models/firstScreenRender').default)
  app.model(require('./models/Post/searchPost').default)

  app.model(require('./models/User/login').default);
  app.model(require('./models/User/register').default);

  // 4. Router
  app.router(appRoutes);

  // 5. Start
  // const App = app.start()
  // ReactDOM.render(
  //   <LocaleProvider locale={zh_CN}><App /></LocaleProvider>,
  //   document.getElementById('root'))
  app.start('#root')
}
