import { routerRedux } from "dva/router";

import { postJSON } from "utils"
import config from 'config/constants'
import {hasStorageKey} from 'utils'

export default {
  namespace: 'user',
  state: {
    userId: null,
    userToken: null,
    userInfo: null,
    loginSuccessPage: '/'
  },
  reducers: {
    clearLoginInfo (state) {
      let key = config.USER_TOKEN_STORAGE_NAME
      if (hasStorageKey(key)) {
        window.localStorage.removeItem(key)
      }
      return Object.assign({}, state, {
        userId: null,
        userToken: null,
        userInfo: null
      })
    },
    saveLoginInfo (state, {payload}) {
      let {userId, token, userInfo} = payload
      window.localStorage.setItem(
        config.USER_TOKEN_STORAGE_NAME,
        JSON.stringify({id: userId, token}))

      return Object.assign({}, state, {
        userId,
        userToken: token,
        userInfo
      })
    },
    resetLoginSuccessPage (state) {
      return Object.assign({}, state, {loginSuccessPage: '/'})
    },
    setLoginSuccessPage (state, {payload: {page}}) {
      return Object.assign({}, state, {loginSuccessPage: page})
    }
  },
  effects: {
    *login({payload}, {call, put}) {
      let {
        username,
        password,
        loginSuccessPage,
        successCallback,
        failCallback
      } = payload
      let res = yield call(() => postJSON(
        '/api/user/doLogin', {
          userName: username, password}
      ))
      console.log(res)
      let {data: {code, message, body}} = res
      if (code === 100) {
        let {userId, token, ...rest} = body
        yield put({
          type: 'saveLoginInfo',
          payload: {
            userId,
            token,
            userInfo: rest
          }
        })
        successCallback(`${rest.nickName}，欢迎回来！`)
        yield put(routerRedux.push(loginSuccessPage))
        yield put({type: 'resetLoginSuccessPage'})
      } else {
        failCallback(message)
      }
    },
    *checkLogin({payload}, {call, put}) {
      let {token, userId, checkValidCallback} = payload
      let res = yield call(() => postJSON(
        '/api/user/checkIdentity', {
          token,
          userId
        }))
      // console.log(res)
      let {data: {code, body}} = res
      if (code === 100) {
        // console.log('......')
        // console.log(token)
        // console.log('......')
        yield put({
          type: 'saveLoginInfo',
          payload: {
            token,
            userId,
            userInfo: body
          }
        })
      } else {
        yield put({
          type: 'clearLoginInfo'
        })
      }
    },
    *logout({payload}, {call, put}) {
      let {userId, successCallback, failCallback} = payload
      let res = yield call(() => postJSON('/api/user/doLogout', {
        userId
      }))
      console.log(res)
      let {data: {code, message}} = res
      if (code === 100) {
        yield put({type: 'clearLoginInfo'})
        successCallback()
      } else {
        failCallback(message)
      }
    }
  }
}
