import { postJSON } from "utils"
import config from 'config/constants'

export default {
  namespace: 'notify',
  state: {
    notifyNum: 0,
    notifies: []
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *getNumber({ payload }, { call, put }) {
      let { userId } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/push/getNotificationNum`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'setState',
          payload: { notifyNum: body }
        })
      }
    },
    *getAll({ payload }, { call, put }) {
      let { userId } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/push/getNotification`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'setState',
          payload: { notifies: body }
        })
      }
    }
  }
}
