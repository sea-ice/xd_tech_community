import dva from 'dva';

import {initRootFontSize} from './utils/dom'
import './index.css';

initRootFontSize()
startApp()

function startApp() {
  // 1. Initialize
  const app = dva();

  // 2. Plugins
  // app.use({});

  // 3. Model
  // app.model(require('./models/example').default);

  // 4. Router
  app.router(require('./router').default);

  // 5. Start
  app.start('#root');
}
