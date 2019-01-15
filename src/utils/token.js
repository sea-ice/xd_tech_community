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
