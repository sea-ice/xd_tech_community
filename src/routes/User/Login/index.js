import React, { Component } from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import LoginForm from './LoginForm'

class UserLoginPage extends Component {
  constructor (props) {
    super(props)
  }
  UNSAFE_componentWillMount() {
    let { dispatch, loginUserId } = this.props
    if (!!loginUserId) {
      dispatch(routerRedux.push('/404'))
    }
  }
  render () {

    return (
      <div>
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

export default connect(state => ({
  loginUserId: state.user.userId,
}))(UserLoginPage);
