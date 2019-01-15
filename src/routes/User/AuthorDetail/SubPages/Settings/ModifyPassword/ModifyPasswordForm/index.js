import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { connect } from 'dva';

// import styles from './index.scss'

class ModifyPasswordForm extends Component {
  constructor (props) {
    super(props)
    this.modifyPassword = this.modifyPassword.bind(this)
    this.onPasswordChange = this.onInputChange.bind(this, 'password')()
    this.onConfirmPasswordChange = this.onInputChange.bind(this, 'confirmPassword')()
  }
  onInputChange(fieldName) {
    let fields = ['password', 'confirmPassword']
    return () => {
      let { form } = this.props
      let anotherField = fieldName === fields[0] ? fields[1] : fields[0]
      let fieldValue = form.getFieldValue(fieldName)
      let anotherFieldValue = form.getFieldValue(anotherField)

      if (
        !!anotherFieldValue &&
        (form.getFieldValue(fields[0]).length >= 6) &&
        (anotherFieldValue !== fieldValue) &&
        !form.getFieldError(fieldName)
      ) {
        console.log(fieldName)

        form.setFields({
          [fieldName]: {
            errors: [new Error('两次输入的密码不一致！')]
          }
        })
      }
    }
  }
  modifyPassword () {
    let { dispatch, form, username } = this.props
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
      type: 'register/resetPassword',
      payload: {
        username,
        password,
        successCallback: () => {
          this.props.onComplete()
        },
        failCallback: (msg) => {
          message.error(`修改失败！${msg}`)
        }
      }
    })
  }
  render () {
    let { getFieldDecorator } = this.props.form
    let fieldLayout = { labelCol: { span: 4, offset: 4 }, wrapperCol: { span: 8 } }

    return (
      <Form>
        <Form.Item {...fieldLayout} label="新密码">
          {
            getFieldDecorator('password', {
              rules: [
                { required: true, message: '请填写新密码！' },
                { min: 6, message: '密码长度不得少于6位！' }
              ]
            })(
              <Input type="password" size="large" style={{ width: '100%' }} placeholder="请填写新密码"
                onChange={this.onPasswordChange} />
            )
          }
        </Form.Item>
        <Form.Item {...fieldLayout} label="确认密码">
          {
            getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: '请填写确认密码！' }
              ]
            })(
              <Input type="password" size="large" style={{ width: '100%' }} placeholder="请填写确认密码"
                onChange={this.onConfirmPasswordChange} />
            )
          }
        </Form.Item>
        <Form.Item wrapperCol={{span: 8, offset: 7}}>
          <Button type="primary" block onClick={this.modifyPassword}>确认修改</Button>
        </Form.Item>
      </Form>
    );
  }
}

ModifyPasswordForm.propTypes = {
};

export default connect(state => ({
  username: state.user.username
}))(Form.create({
  // 此处的props是增强后的ModifyPasswordForm的props，而非被增强的原组件，意味着props.form并不能访问到内部的this.props.form
  onValuesChange (props, changedValues) {}
})(ModifyPasswordForm));
