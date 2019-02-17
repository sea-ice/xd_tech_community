import { postJSON } from "utils"
import config from 'config/constants'

export default {
  namespace: 'msgs',
  state: {
    totalUnreadNum: 0,
    privateMsgs: {
      loading: false,
      total: 0, // 包括已读和未读
      msgs: [],
      currentPage: 0,
      unreadNum: 0
    },
    userMsgs: {
      loading: false, // 加载分页数据时的loading
      total: 0, // 包括已读和未读
      msgs: [],
      currentPage: 0,
      unreadNum: 0
    },
    sysMsgs: {
      loading: false, // 加载分页数据时的loading
      total: 0, // 包括已读和未读
      msgs: [],
      currentPage: 0,
      unreadNum: 0
    }
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    },
    setInfo(state, { payload }) {
      let { key, newInfo } = payload
      let info = Object.assign({}, state[key], newInfo)
      return Object.assign({}, state, {
        [key]: info
      })
    },
    setMsgItem(state, { payload }) {
      let { msgType, itemFilter, newItem } = payload
      let msgs = state[msgType].msgs.slice()
      let itemIdx = msgs.findIndex(itemFilter)
      if (~itemIdx) {
        let item = Object.assign({}, msgs[itemIdx], newItem)
        msgs.splice(itemIdx, 1, item)
        return Object.assign({}, state, {
          [msgType]: Object.assign({}, state[msgType], { msgs })
        })
      } else {
        return state
      }
    },
    setAllMsgItems(state, { payload }) {
      let { msgType, newItem } = payload
      let msgs = state[msgType].msgs.map(
        item => Object.assign({}, item, newItem))
      return Object.assign({}, state, {
        [msgType]: Object.assign({}, state[msgType], { msgs })
      })
    }
  },
  effects: {
    *getUnreadNumber({ payload }, { all, call, put }) {
      // 获取未读消息的总数目
      let { userId } = payload
      let [privateMsgUnreadNum, userMsgsUnreadNum, sysMsgsUnreadNum] = yield (yield all([
        put({
          type: 'getSingleTypeMsgUnreadNum',
          payload: {
            msgType: 'privateMsgs',
            url: `${config.SERVER_URL_API_PREFIX}/secretMsg/getNotReadMsgNum`,
            userId
          }
        }), // 未读私信数量
        put({
          type: 'getSingleTypeMsgUnreadNum',
          payload: {
            msgType: 'userMsgs',
            url: `${config.SERVER_URL_API_PREFIX}/push/getNotificationNum`,
            userId
          }
        }), // 未读用户消息
        put({
          type: 'getSingleTypeMsgUnreadNum',
          payload: {
            msgType: 'sysMsgs',
            url: `${config.SERVER_URL_API_PREFIX}/push/getNotReadSystemNotifyNum`,
            userId
          }
        })
        // 未读系统消息
      ]))
      yield put({
        type: 'setState',
        payload: {
          totalUnreadNum: privateMsgUnreadNum + userMsgsUnreadNum + sysMsgsUnreadNum
        }
      })
    },
    *getSingleTypeMsgUnreadNum({ payload }, { call, put }) {
      let { msgType, url, userId } = payload
      let res = yield call(() => postJSON(url, {
        userId
      }))

      let { data: { code, body } } = res
      let unreadNum = code === 100 ? body : 0
      yield put({
        type: 'setInfo',
        payload: {
          key: msgType,
          newInfo: { unreadNum }
        }
      })
      return unreadNum
    },
    *getSingleTypeMsgPageData({ payload }, { call, put }) {
      let { msgType, getTotalNumURL, getPageDataURL, userId, page, number } = payload
      yield put({
        type: 'setInfo',
        payload: {
          key: msgType,
          newInfo: { loading: true }
        }
      })

      let res = yield call(() => postJSON(
        getTotalNumURL, {
          userId
        }))
      let { data: { code, body } } = res
      let newInfo
      if (code === 100) {
        let msgNum = body
        if (!msgNum) {
          // 没有历史消息
          newInfo = { msgs: [], currentPage: 0, total: 0, loading: false }
        } else {
          let total = msgNum, msgs = []
          let currentPage = Math.min(Math.ceil(msgNum / number), page)
          let res = yield call(() => postJSON(
            getPageDataURL, {
              lastId: 0,
              userId,
              page: 0,
              number: currentPage * number
            }))
          let { data: { code, body } } = res
          if (code === 100) {
            let pageStart = (currentPage - 1) * number
            msgs = body.slice(pageStart, pageStart + number)

            newInfo = { msgs, currentPage, total, loading: false }
          } else {
            newInfo = { loading: false, error: true }
          }
        }
      } else {
        newInfo = { loading: false, error: true }
      }
      return newInfo
    },
  }
}
