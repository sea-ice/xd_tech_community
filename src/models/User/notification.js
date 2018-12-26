import { postJSON } from "utils"
import config from 'config/constants'

export default {
  namespace: 'notify',
  state: {
    unreadTotalNum: 0, // 包括私信和用户行为消息（未读）
    notifies: []
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *getNumber({ payload }, { all, call, put }) {
      // 获取未读消息的总数目
      // 目前只获取未读私信的数目作为header badge中显示的数字
      let { userId } = payload
      let [privateMsgUnreadNum] = yield (yield all([
        put({
          type: 'privateMsg/getUnReadNumber',
          payload: {userId}
        }), // 未读私信数量
      ]))
      yield put({
        type: 'setState',
        payload: {
          unreadTotalNum: privateMsgUnreadNum
        }
      })
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
