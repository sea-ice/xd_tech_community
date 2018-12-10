import React, {Component} from 'react';
import {Form, Input, Icon, Button, message} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'

import styles from './index.scss'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.toRegister = this.toRegister.bind(this)
    this.login = this.login.bind(this)
  }
  login () {
    let {form, dispatch, loginSuccessPage} = this.props

    form.validateFields()
    let validateErr = form.getFieldsError()
    let hasValidateErr = Object.keys(validateErr).some(key => !!validateErr[key])
    if (hasValidateErr) return

    let {username, password} = form.getFieldsValue()
    // console.log(username)
    dispatch({
      type: 'user/login',
      payload: {
        username,
        password,
        loginSuccessPage,
        successCallback (msg) {
          message.success(msg)
        },
        failCallback (msg) {
          message.error(msg)
        }
      }
    })
  }
  toRegister () {
    let {dispatch} = this.props
    dispatch(routerRedux.push('/login'))
  }
  render () {
    let {getFieldDecorator} = this.props.form
    return (
      <Form className={styles.loginForm}>
        <Form.Item>
          {
            getFieldDecorator('username', {
              rules: [
                {required: true, message: '请填写注册时的手机号'},
                {pattern: /^1[34578]\d{9}$/, message: '请输入正确格式的手机号！'}
              ]
            })(
              <Input prefix={<Icon type="user" />} placeholder="请填写注册时的手机号" size="large" className={styles.input} />
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('password', {
              rules: [
                {required: true, message: '请填写登录密码！'}
              ]
            })(
              <Input prefix={<Icon type="lock" />} type="password" placeholder="请填写登录密码" size="large" className={styles.input} />
            )
          }
        </Form.Item>
        <Form.Item>
          <div className={styles.forgetPassword}>
            <a href="javascript:void(0);">忘记密码？</a>
          </div>
          <Button type="primary" className={styles.loginBtn} onClick={this.login}>登&nbsp;录</Button>
          <p className={styles.registerTips}>还没有账号？<a href="javascript:void(0);" onClick={this.toRegister}>马上注册</a></p>
        </Form.Item>
      </Form>
    );
  }
}

LoginForm.propTypes = {
};

export default connect(state => ({
  loginSuccessPage: state.user.loginSuccessPage
}))(Form.create()(LoginForm));