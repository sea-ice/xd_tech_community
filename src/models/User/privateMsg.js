import { postJSON } from "utils"
import config from 'config/constants'

export default {
  namespace: 'privateMsg',
  state: {
    total: 0
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *send({ payload }, { call, put }) {
      let { userId, receiverId, content, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/sendSecretMsg`, {
          senderId: userId,
          receiverId,
          content,
          time: '' + Date.now()
        }))
      let { data: { code } } = res
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    },

    *getAllNumber({ payload }, { all, call, put }) {
      // 同时获取已发送的和已收到的私信
      let { userId } = payload
      let [receiveNumRes, sendNumRes] = yield all([
        call(() => postJSON(
            `${config.SERVER_URL_API_PREFIX}/secretMsg/getReceivedMsg`, {
            userId
          })),
        call(() => postJSON(
            `${config.SERVER_URL_API_PREFIX}/secretMsg/getSendMsg`, {
              userId
          })),
      ])
      let { data: { code, body } } = receiveNumRes

      if (code === 100) {
        let receiveNum = body
        ;({ data: { code, body } } = sendNumRes)
        if (code === 100) {
          yield put({
            type: 'setState',
            payload: { total: receiveNum + body }
          })
        }
      }
    }
  }
}
