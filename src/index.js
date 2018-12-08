import dva from 'dva';
import createHistory from 'history/createBrowserHistory'

import initialState from './initialState'
import {initRootFontSize} from './utils/dom'
import './index.css';

initRootFontSize()
startApp()

function startApp() {
  // 1. Initialize
  const app = dva({
    initialState,
    history: createHistory({
      forceRefresh: !('pushState' in window.history)// 仅在浏览器不支持HTML5 History API时启用强制刷新
    })
  });

  // 2. Plugins
  // app.use({});

  // 3. Model
  app.model(require('./models/Post/recommendPosts').default);
  app.model(require('./models/User/login').default);
  app.model(require('./models/User/register').default);

  // 4. Router
  app.router(require('./router').default);

  // 5. Start
  app.start('#root');
}
