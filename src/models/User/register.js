import { postJSON } from "utils"
import config from 'config/constants'
import { getSmsCode, verifySmsCode } from 'services/user/register'
import leanCloudServices from 'leancloud-storage'

export default {
  namespace: 'register',
  state: {
    saveRegisterName: '',
    saveResetPasswordName: ''
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    },
  },
  effects: {
    *register({payload}, {call}) {
      let {username, password, successCallback, failCallback} = payload
      let registerApi = () => postJSON(
        `${config.SERVER_URL_API_PREFIX }/user/doRegister`, {
        userName: username,
        password
      })
      let res = yield call(registerApi)
      let {data: {code, message}} = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback(message)
      }
      console.log(res)
    },

    *checkRegister({ payload }, { call, put }) {

      let {
        username,
        checkFailCallback,
        sendSuccessCallback,
        sendCodeFailCallback
      } = payload
      let checkRes = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/checkPhone`, {
        userName: username
      }))
      let { data: { code, message } } = checkRes
      console.log(checkRes)
      if (code === 100) {
        // 最后再调用leancloud接口发送验证码
        yield put({
          type: 'getSmsCode',
          payload: {
            username,
            successCallback: sendSuccessCallback,
            failCallback: sendCodeFailCallback
          }
        })
      } else {
        checkFailCallback(message)
      }
    },
    *resetPassword({ payload }, { call, put }) {
      let { username, password, successCallback, failCallback } = payload
      let checkRes = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/resetPassword`, {
          userName: username,
          password
        }))
      let { data: { code } } = checkRes
      console.log(checkRes)
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    },
    *checkUserExist({ payload }, { call, put }) {
      let { username, checkFailCallback, sendSuccessCallback } = payload
      let checkRes = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/checkPhone`, {
          userName: username
        }))
      let { data: { code, message } } = checkRes
      console.log(checkRes)
      if (code === 202) {
        // 需要确保用户账号已注册，在重置密码时使用
        // 最后再调用leancloud接口发送验证码
        yield put({
          type: 'getSmsCode',
          payload: {
            username,
            successCallback: sendSuccessCallback
          }
        })
      } else if (code === 100) {
        checkFailCallback('输入的手机号有误')
      } else {
        checkFailCallback(message)
      }
    },
    // https://leancloud.cn/docs/rest_sms_api.html#hash889571772
    getSmsCode({ payload }, { call }) {
      // let code = yield call(getSmsCode, {phone: payload.username})
      // console.log(code)
      let { username, successCallback, failCallback } = payload
      console.log(leanCloudServices)
      leanCloudServices.Cloud.requestSmsCode({
        mobilePhoneNumber: username,
        name: '源来',
        op: '注册',
        ttl: 5
      }).then(() => {
        if (successCallback) successCallback()
      }).catch(err => {
        if (failCallback) failCallback(err)
      })
    },
    verifySmsCode({ payload }, { call }) {
      let { phone, code, successCallback, failCallback } = payload
      leanCloudServices.Cloud.verifySmsCode(code, phone).then(res => {
        if (successCallback) successCallback()
      }).catch(err => {
        if (failCallback) failCallback(err)
      })
    }
  }
}
