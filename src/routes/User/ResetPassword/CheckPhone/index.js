import React, {Component} from 'react';
import {Form, Input, Button} from 'antd'
import {connect} from 'dva'

import styles from './index.scss'

@connect()
@Form.create()
class CheckPhone extends Component {
  constructor (props) {
    super(props)
    this.getSmsCode = this.getSmsCode.bind(this)
    this.checkIdentifyCode = this.checkIdentifyCode.bind(this)
    this.state = {
      getSmsCode: false,
      getCodeTimeout: -1
    }
  }

  getSmsCode () {
    // 在获取验证码之前，需要先检验手机号格式是否正确
    let {form, dispatch} = this.props
    form.validateFields(['username'])
    let validateErr = form.getFieldError('username')
    if (validateErr) return

    // 然后再验证是否已经注册
    let username = form.getFieldValue('username')
    dispatch({
      type: 'register/checkUserExist',
      payload: {
        username,
        checkFailCallback: (msg) => {
          form.setFields({
            username: {
              errors: [new Error(msg)]
            }
          })
        },
        sendSuccessCallback: () => {
          let timeout = () => {
            let { getCodeTimeout } = this.state
            this.setState({ getCodeTimeout: getCodeTimeout - 1 })
            if (getCodeTimeout === 0) {
              clearTimeout(this.timeout)
            } else {
              this.timeout = setTimeout(timeout, 1000)
            }
          }
          this.setState({
            getSmsCode: true,
            getCodeTimeout: 59
          }, () => { this.timeout = setTimeout(timeout, 1000) })
        }
      }
    })
  }

  checkIdentifyCode () {
    let { dispatch, form } = this.props
    form.validateFields()
    let validateErr = form.getFieldsError()
    console.log(validateErr)
    let hasValidateErr = Object.keys(validateErr).some(key => !!validateErr[key])
    if (hasValidateErr) return

    let phone = form.getFieldValue('username')
    let smsCode = form.getFieldValue('smsCode')
    dispatch({
      type: 'register/verifySmsCode',
      payload: {
        phone,
        code: smsCode,
        successCallback: () => {
          // 保存当前手机号到store中，用于后面的注册
          dispatch({
            type: 'register/setState',
            payload: {
              saveResetPasswordName: phone
            }
          })
          this.props.onComplete()
        },
        failCallback: () => {
          form.setFields({
            smsCode: {
              errors: [new Error('验证码输入错误，请重新输入！')]
            }
          })
        }
      }
    })
  }
  render () {
    let { getFieldDecorator } = this.props.form
    let { getSmsCode, getCodeTimeout, filledValidVal } = this.state
    let fieldLayout = { labelCol: { span: 4, offset: 4 }, wrapperCol: { span: 8 } }
    return (
      <Form>
        <Form.Item {...fieldLayout} label="手机号">
          {
            getFieldDecorator('username', {
              rules: [
                {required: true, message: '请填写手机号'},
                {pattern: /^1[34578]\d{9}$/, message: '请输入正确格式的手机号！'}
              ]
            })(
              <Input placeholder="请填写手机号" size="large" style={{width: '100%'}} />
            )
          }
        </Form.Item>
        <Form.Item {...fieldLayout} label="验证码">
          {
            getFieldDecorator('smsCode', {
              rules: [
                {required: true, message: '请填写验证码'}
              ]
            })(
              <div className={styles.smsCodeWrapper}>
                <Input placeholder="请填写验证码" size="large" />
                <div className={styles.getCodeBtnWrapper}>
                  {
                    getCodeTimeout === -1 ? (
                      <Button size="large" onClick={this.getSmsCode}>获取验证码</Button>
                    ) : (
                      <Button size="large" disabled>{getCodeTimeout}秒后重新获取</Button>
                    )
                  }
                </div>
              </div>
            )
          }
        </Form.Item>
        <Form.Item wrapperCol={{span: 8, offset: 7}}>
          <Button type="primary" disabled={!getSmsCode} block onClick={this.checkIdentifyCode}>下一步</Button>
        </Form.Item>
      </Form>
    );
  }
}

CheckPhone.propTypes = {
};

export default CheckPhone;
