import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { connect } from 'dva'

// import styles from './index.scss'

class SetPassword extends Component {
  constructor(props) {
    super(props)
    this.register = this.register.bind(this)
  }
  register() {
    let { dispatch, username } = this.props
    let { password, confirmPassword, passwordValidateState, confirmPasswordValidateState } = this.props

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
      password, confirmPassword,
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
        <Form.Item wrapperCol={{ span: 8, offset: 7 }}>
          <Button type="primary" block onClick={this.register}>立即注册</Button>
        </Form.Item>
      </Form>
    );
  }
}

SetPassword.propTypes = {
};

export default connect(state => ({
  username: state.register.saveRegisterName
}))(Form.create({
  // 此处的props是增强后的SetPassword的props，而非被增强的原组件，意味着props.form并不能访问到内部的this.props.form
  onValuesChange(props, changedValues) { }
})(SetPassword));
