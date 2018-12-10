import { postJSON } from "utils"
import {getSmsCode, verifySmsCode} from 'services/user/register'

export default {
  namespace: 'register',
  state: {
    saveRegisterName: ''
  },
  reducers: {
    saveRegisterName (state, {payload}) {
      let {username} = payload
      return Object.assign({}, state, {saveRegisterName: username})
    }
  },
  effects: {
    *register({payload}, {call}) {
      let {username, password, successCallback, failCallback} = payload
      let registerApi = () => postJSON('/api/user/doRegister', {
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
    *checkRegister({payload}, {call, put}) {
      let {username, checkFailCallback, sendSuccessCallback} = payload
      let checkRes = yield call(() => postJSON('/api/user/checkPhone', {
        userName: username
      }))
      let {data: {code, message}} = checkRes
      console.log(checkRes)
      if (code === 100) {
        // 最后再调用leancloud接口发送验证码
        yield put({
          type: 'getSmsCode',
          payload: {
            username,
            successCallback: sendSuccessCallback
          }
        })
      } else {
        checkFailCallback(message)
      }
    },
    // https://leancloud.cn/docs/rest_sms_api.html#hash889571772
    *getSmsCode({payload}, {call}) {
      // let code = yield call(getSmsCode, {phone: payload.username})
      // console.log(code)
      yield Promise.resolve()
      payload.successCallback()
    },
    *verifySmsCode ({payload}, {call}) {
      let {successCallback, failCallback, ...rest} = payload
      // let verifyRes = yield call(verifySmsCode, rest)
      // if (verifyRes.code === 0) {
        successCallback()
      // } else {
        // failCallback()
      // }
    }
  }
}
