import React, {Component} from 'react';
import { Form, Input, Button, message } from 'antd'
import {connect} from 'dva'

import styles from './index.scss'

@connect(state => ({
  username: state.user.username
}))
@Form.create()
class CheckOldPassword extends Component {
  state = {
    oldPassword: '',
    validateState: 'validate-failed' // 两种状态：'to-validate', 'validate-failed'
  }

  constructor (props) {
    super(props)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
  }

  onPasswordChange(e) {
    let oldPassword = e.target.value
    let newState = { oldPassword }

    Object.assign(newState, {
      validateState: oldPassword.length >= 6 && !!oldPassword.match(
        /[a-zA-z0-9`~!@#$%\^&*(){}:<>?/\\.,;'"|=+-_]+/) ? 'to-validate' : 'validate-failed'
    })

    this.setState(newState)
  }

  validatePassword() {
    let { dispatch, username } = this.props
    let { oldPassword, validateState } = this.state

    if (oldPassword.length > 16) {
      message.error('验证失败！')
      this.setState({ validateState: 'validate-failed' })
      return
    }

    if (validateState === 'loading') return
    this.setState({ validateState: 'loading' })
    dispatch({
      type: 'user/validatePassword',
      payload: {
        username,
        password: oldPassword,
        successCallback: () => {
          message.success('验证成功！')
          this.props.onComplete()
        },
        failCallback: () => {
          message.error('验证失败！')
          this.setState({ validateState: 'validate-failed' })
        }
      }
    })

  }
  render () {
    let { validateState, oldPassword } = this.state
    let fieldLayout = { labelCol: { span: 4, offset: 4 }, wrapperCol: { span: 8 } }
    return (
      <Form>
        <Form.Item {...fieldLayout} label="旧密码">
          <Input
            placeholder="请输入旧密码"
            type="password"
            size="large" style={{ width: '100%' }}
            value={oldPassword}
            onChange={this.onPasswordChange}
            onPressEnter={this.validatePassword}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 7 }}>
          {validateState === 'loading' ? (
            <Button type="primary" loading block>验证中</Button>
          ) : (
            <Button
              type="primary"
              disabled={validateState === 'validate-failed'} block
              onClick={this.checkIdentifyCode}
            >验证</Button>
          )}
        </Form.Item>
      </Form>
    );
  }
}

CheckOldPassword.propTypes = {
};

export default CheckOldPassword;
