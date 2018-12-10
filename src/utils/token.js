import React, {Component} from 'react'
import {connect} from 'dva'

import config from 'config/constants'

export function checkLogin (opt) {
  return C => connect(state => ({
    userToken: state.user.userToken,
    userId: state.user.userId
  }))(class extends Component {
    componentDidMount () {
      let {dispatch, userToken, userId} = this.props
      let {checkLoginFinish} = opt
      if (userToken && userId) {
        // 检查store中的token是否过期
        dispatch({
          type: 'user/checkLogin',
          payload: {
            token: userToken,
            userId,
            checkLoginFinish
          }
        })
      } else {
        // 检查本地存储token
        let store = window.localStorage.getItem(
          config.USER_TOKEN_STORAGE_NAME)
        if (store) {
          let {token, id} = JSON.parse(store)
          dispatch({
            type: 'user/checkLogin',
            payload: {
              token,
              userId: id,
              checkLoginFinish
            }
          })
        } else {
          // token不存在，则清除store中存储的登录信息
          dispatch({
            type: 'checkLoginInvalid',
            payload: {checkLoginFinish}
          })
        }
      }

    }
    render () {
      return (
        <C {...this.props} />
      )
    }
  })
}
