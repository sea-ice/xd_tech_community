import React, {Component} from 'react';
import {Form, Input, Button, notification} from 'antd'
import { connect } from 'dva';

// import styles from './index.scss'

class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.register = this.register.bind(this)
  }
  register () {
    let {dispatch, form, username} = this.props
    form.validateFields()
    let validateErr = form.getFieldsError()
    let hasValidateErr = Object.keys(validateErr).some(key => !!validateErr[key])
    if (hasValidateErr) return

    let password = form.getFieldValue('password')
    let confirmPassword = form.getFieldValue('confirmPassword')
    if (password !== confirmPassword) {
      form.setFields({
        confirmPassword: {
          errors: [new Error('两次输入的密码不一致！')]
        }
      })
      return
    }
    dispatch({
      type: 'register/register',
      payload: {
        username,
        password,
        successCallback: () => {
          this.props.onComplete()
        },
        failCallback: (msg) => {
          notification.warn({
            message: 'Warning',
            description: `注册失败！${msg}`
          })
        }
      }
    })
  }
  render () {
    let {getFieldDecorator} = this.props.form
    let fieldLayout = {labelCol: {span: 4, offset: 4}, wrapperCol: {span: 8}}

    return (
      <Form>
        <Form.Item {...fieldLayout} label="密码">
          {
            getFieldDecorator('password', {
              rules: [
                {required: true, message: '请填写密码！'},
                {min: 6, message: '密码长度不得少于6位！'}
              ]
            })(
              <Input type="password" size="large" style={{width: '100%'}} placeholder="请填写密码" />
            )
          }
        </Form.Item>
        <Form.Item {...fieldLayout} label="确认密码">
          {
            getFieldDecorator('confirmPassword', {
              rules: [
                {required: true, message: '请填写确认密码！'}
              ]
            })(
              <Input type="password" size="large" style={{width: '100%'}} placeholder="请填写确认密码" />
            )
          }
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

export default connect(state => ({
  username: state.register.saveRegisterName
}))(Form.create({
  // 此处的props是增强后的RegisterForm的props，而非被增强的原组件，意味着props.form并不能访问到内部的this.props.form
  onValuesChange (props, changedValues) {}
})(RegisterForm));