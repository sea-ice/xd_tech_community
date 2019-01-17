import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { connect } from 'dva'

import { checkPassword } from 'utils'

@connect(state => ({
  username: state.register.saveRegisterName
}))
@checkPassword
class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.register = this.register.bind(this)
  }
  register () {
    let {
      dispatch,
      username,
      password,
      confirmPassword,
      passwordValidateState,
      confirmPasswordValidateState
    } = this.props

    if (
      !!password &&
      password === confirmPassword &&
      Object.keys(passwordValidateState).length === 0 &&
      Object.keys(confirmPasswordValidateState).length === 0
    ) {
      dispatch({
        type: 'register/register',
        payload: {
          username,
          password,
          successCallback: () => {
            this.props.onComplete()
          },
          failCallback: (msg) => {
            message.error(`注册失败！${msg}`)
          }
        }
      })
    }
  }
  render() {
    let {
      password,
      confirmPassword,
      passwordValidateState,
      confirmPasswordValidateState,
      onPasswordChange,
      onConfirmPasswordChange
    } = this.props
    let fieldLayout = { labelCol: { span: 4, offset: 4 }, wrapperCol: { span: 8 } }

    return (
      <Form>
        <Form.Item {...fieldLayout} {...passwordValidateState} label="密码">
          <Input
            type="password"
            size="large" style={{ width: '100%' }}
            placeholder="请填写密码"
            value={password}
            onChange={onPasswordChange} />
        </Form.Item>
        <Form.Item {...fieldLayout} {...confirmPasswordValidateState} label="确认密码">
          <Input
            type="password"
            size="large" style={{ width: '100%' }}
            placeholder="请填写确认密码"
            value={confirmPassword}
            onChange={onConfirmPasswordChange} />
        </Form.Item>
        <Form.Item wrapperCol={{span: 8, offset: 7}}>
          <Button type="primary" block onClick={this.register}>立即注册</Button>
        </Form.Item>
      </Form>
    );
  }
}

RegisterForm.propTypes = {
};

export default RegisterForm
