import { routerRedux } from "dva/router";

import { postJSON } from "utils"
import config from 'config/constants'
import { hasStorageKey, generateUUID } from 'utils'

export default {
  namespace: 'user',
  state: {
    userId: null,
    userToken: null,
    userInfo: null,
    loginSuccessPage: '/'
  },
  reducers: {
    clearLoginInfo(state) {
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
    setUUID(state) {
      let key = config.UUID_STORAGE_NAME
      if (!hasStorageKey(key)) {
        window.localStorage.setItem(key, generateUUID())
      }
      return Object.assign({}, state, {
        uuid: window.localStorage.getItem(key)
      })
    },
    saveLoginInfo(state, { payload }) {
      let { userId, username, token, userInfo } = payload
      window.localStorage.setItem(
        config.USER_TOKEN_STORAGE_NAME,
        JSON.stringify({ id: userId, token, username }))

      return Object.assign({}, state, {
        userId,
        username,
        userToken: token,
        userInfo: { ...userInfo, userId }
      })
    },
    resetLoginSuccessPage (state) {
      return Object.assign({}, state, {loginSuccessPage: '/'})
    },
    setLoginSuccessPage(state, { payload: { page } }) {
      let loginSuccessPage = !!(['/login', '/register', '/reset_password'].find(
        path => !!~page.indexOf(path))) ? '/' : page // 当前如果是数组中列出的路径，则登录成功后跳转到首页
      return Object.assign({}, state, { loginSuccessPage })
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      let {
        username,
        password,
        loginSuccessPage,
        successCallback,
        failCallback
      } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/doLoginWeb`, {
          userName: username, password}
      ))
      console.log(res)
      let { data: { code, message, body } } = res
      if (code === 100) {
        let { userId, token, ...rest } = body
        yield put({
          type: 'saveLoginInfo',
          payload: {
            username,
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
    *checkLogin({ payload }, effects) {
      let { call, put } = effects
      let { token, userId, username, checkLoginFinish, props, noTryCheckLoginAgain } = payload
      try {
        // token验证失败时会返回html页面
        let res = yield call(() => postJSON(
          `${config.SERVER_URL_API_PREFIX}/user/checkIdentityWeb`, {
            token,
            userId
          }))
        console.log(res)
        let { data: { code, body } } = res
        if (code === 100) {
          console.log('check token success')
          yield put({
            type: 'saveLoginInfo',
            payload: {
              token,
              userId,
              username,
              userInfo: body
            }
          })
          if (checkLoginFinish) {
            yield* checkLoginFinish({ userId, ...body }, effects, props)
          }
        } else {
          // 如果出错，则再重试验证一次
          yield* tryCheckLoginAgainOrNot()
        }
      } catch (e) {
        console.log('catch check login error')
        yield* tryCheckLoginAgainOrNot()
      }
      function* tryCheckLoginAgainOrNot() {
        if (!!noTryCheckLoginAgain) {
          console.log('check token failed')
          yield put({
            type: 'checkLoginInvalid',
            payload: { checkLoginFinish, props }
          })
        } else {
          console.log('check token again')
          yield put({
            type: 'tryCheckLoginAgain',
            payload
          })
        }
      }
    },
    *tryCheckLoginAgain({ payload }, { call, put }) {
      yield put({
        type: 'checkLogin',
        payload: {
          ...payload,
          noTryCheckLoginAgain: true
        }
      })
    },
    *checkLoginInvalid({ payload }, effects) {
      let { put } = effects
      let { checkLoginFinish, props } = payload
      yield put({ type: 'clearLoginInfo' })
      yield put({ type: 'setUUID' })
      if (checkLoginFinish) {
        yield* checkLoginFinish(null, effects, props)
      }
    },
    *validatePassword({ payload }, { call, put }) {
      let { username, password, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/doLoginWeb`, {
          userName: username, password
        }
      ))
      console.log(res)
      let { data: { code, message, body } } = res
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback(message)
      }
    },
    *logout({ payload }, { call, put }) {
      let { userId, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/doLogout`, {
        userId
      }))
      console.log(res)
      let { data: { code, message } } = res
      if (code === 100) {
        yield put({ type: 'clearLoginInfo' })
        successCallback()
      } else {
        failCallback(message)
      }
    }
  }
}
