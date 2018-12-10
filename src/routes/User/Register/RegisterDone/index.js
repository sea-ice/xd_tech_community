import React, {Component} from 'react';
import {Form, Input, Button, notification} from 'antd'
import { connect } from 'dva';
import {routerRedux} from 'dva/router'

import styles from './index.scss'

class RegisterDone extends Component {
  constructor (props) {
    super(props)
    this.toLogin = this.toLogin.bind(this)
  }

  toLogin () {
    let {dispatch} = this.props
    dispatch(routerRedux.push('/login'))
  }

  render () {

    return (
      <main className={styles.wrapper}>
        <img src="/assets/yay.jpg" alt=""/>
        <h2>注册成功!</h2>
        <Button type="primary" onClick={this.toLogin}>去登录</Button>
      </main>
    );
  }
}

RegisterDone.propTypes = {
};

export default connect(state => ({
  username: state.user.saveRegisterName
}))(RegisterDone);
