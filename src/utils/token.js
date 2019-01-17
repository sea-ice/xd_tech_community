import React, { Component } from 'react'
import { connect } from 'dva'

import config from 'config/constants'

export function checkLogin (opt = {}) {
  return C => connect()(class extends Component {
    componentDidMount() {
      let { dispatch } = this.props
      let { checkLoginFinish } = opt

      // 检查本地存储token
      let store = window.localStorage.getItem(
        config.USER_TOKEN_STORAGE_NAME)
      if (store) {
        let { token, id, username } = JSON.parse(store)
        dispatch({
          type: 'user/checkLogin',
          payload: {
            token,
            username,
            userId: id,
            checkLoginFinish,
            props: this.props
          }
        })
      } else {
        // token不存在，则清除store中存储的登录信息
        setTimeout(() => {
          dispatch({
            type: 'user/checkLoginInvalid',
            payload: {
              checkLoginFinish,
              props: this.props
            }
          })
        }, 10)
      }

    }
    render() {
      return (
        <C {...this.props} />
      )
    }
  })
}

/**
 * 生成UUID唯一性标识
 *
 * @export
 * @returns
 */
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
}


export function checkPassword(WrappedComponent) {
  return class extends React.Component {
    state = {
      password: '',
      passwordValidateState: {},
      confirmPassword: '',
      confirmPasswordValidateState: {}
    }
    constructor(props) {
      super(props)
      this.PASSWORD_MIN_LENGTH = 6
      this.PASSWORD_MAX_LENGTH = 16
      this.errors = {
        PASSWORD_DIFFER_ERROR: '两次输入的密码不一致！'
      }
      this.onPasswordChange = this.onPasswordChange.bind(this)
      this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this)
    }
    onPasswordChange(e) {
      let { confirmPassword, confirmPasswordValidateState } = this.state
      let password = e.target.value
      let validateState = {}

      if (!password) {
        validateState = { validateStatus: 'error', help: '请填写密码！' }
      } else if (password.length < this.PASSWORD_MIN_LENGTH) {
        validateState = { validateStatus: 'error', help: `密码长度不得少于${this.PASSWORD_MIN_LENGTH}位！` }
      } else if (password.length > this.PASSWORD_MAX_LENGTH) {
        validateState = { validateStatus: 'error', help: `密码长度不能超过${this.PASSWORD_MAX_LENGTH}位！` }
      } else if (
        !(!!password.match(/[0-9]+/) &&
          !!password.match(/[a-z]+/) &&
          !!password.match(/[A-Z]+/))
      ) {
        validateState = { validateStatus: 'error', help: '登录密码需同时含有数字、大写和小写字母！' }
      } else if (confirmPassword !== password) {
        if (!!confirmPassword) {
          validateState = { validateStatus: 'error', help: this.errors.PASSWORD_DIFFER_ERROR }
        }
      }

      if (
        (Object.keys(validateState).length === 0) &&
        (confirmPassword === password) &&
        (confirmPasswordValidateState.help === this.errors.PASSWORD_DIFFER_ERROR)
      ) {
        confirmPasswordValidateState = {}
      }

      this.setState({
        password,
        passwordValidateState: validateState,
        confirmPasswordValidateState
      })
    }

    onConfirmPasswordChange(e) {
      let { password, passwordValidateState } = this.state
      let confirmPassword = e.target.value
      let validateState = {}

      if (!confirmPassword) {
        validateState = { validateStatus: 'error', help: '请填写确认密码！' }
      } else if (confirmPassword !== password) {
        validateState = { validateStatus: 'error', help: this.errors.PASSWORD_DIFFER_ERROR }
      }

      if (
        (Object.keys(validateState).length === 0) &&
        (confirmPassword === password) &&
        (passwordValidateState.help === this.errors.PASSWORD_DIFFER_ERROR)
      ) {
        passwordValidateState = {}
      }

      this.setState({
        confirmPassword,
        passwordValidateState,
        confirmPasswordValidateState: validateState
      })
    }
    render() {
      return (
        <WrappedComponent
          {...this.state}
          onPasswordChange={this.onPasswordChange}
          onConfirmPasswordChange={this.onConfirmPasswordChange}
          {...this.props}
        />
      )
    }
  }
}