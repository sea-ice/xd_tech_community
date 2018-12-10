import React, {Component} from 'react';
import { connect } from 'dva'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import LoginForm from './LoginForm'

class UserLoginPage extends Component {
  constructor (props) {
    super(props)
  }
  render () {

    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <div className={styles.loginForm}>
            <LoginForm />
          </div>
        </main>
      </div>
    );
  }
}

UserLoginPage.propTypes = {
};

export default connect()(UserLoginPage);
