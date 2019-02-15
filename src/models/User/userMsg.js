import { postJSON, setItemsBgColor } from "utils"
import config from 'config/constants'

export default {
  namespace: 'msgs',
  state: {
    userMsgs: {
      loading: false, // 加载分页数据时的loading
      total: 0, // 包括已读和未读
      msgs: [],
      currentPage: 0,
      unReadNum: 0
    },
    sysMsgs: {
      loading: false, // 加载分页数据时的loading
      total: 0, // 包括已读和未读
      msgs: [],
      currentPage: 0,
      unReadNum: 0
    }
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    },
    setItem(state, { payload }) {
      let { key, itemFilter, newItem } = payload
      let items = state[key].slice()
      let itemIdx = items.findIndex(itemFilter)
      if (~itemIdx) {
        let item = Object.assign({}, items[itemIdx], newItem)
        items.splice(itemIdx, 1, item)
        return Object.assign({}, state, {
          [key]: items
        })
      } else {
        return state
      }
    },
    setInfo(state, { payload }) {
      let { key, newInfo } = payload
      let info = Object.assign({}, state[key], newInfo)
      return Object.assign({}, state, {
        [key]: info
      })
    },
  },
  effects: {
    *getUnReadMsgNumber({ payload }, { call, put }) {
      // 获取未读通知数（用户消息+系统消息）
      let { userId } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/push/getNotificationNum`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        return body
      }
      return 0
    },
    *getPageData({ payload }, { all, call, put }) {
      let { userId, msgType, page, number } = payload
      let stateKey = `${msgType}Msgs`

      // 设置loading
      yield put({
        type: 'setInfo',
        payload: {
          key: stateKey,
          newInfo: { loading: true }
        }
      })
      // 每一次获取分页消息之前都先获取消息的总条数
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/getMsgNum`, {
          userId
        }))
      let { data: { code, body } } = res
      let newState
      if (code === 100) {
        let msgNum = body
        if (!msgNum) {
          // 没有历史消息
          newState = { msgs: [], currentPage: 0, total: 0, loading: false }
        } else {
          let total = msgNum, msgs = []
          let currentPage = Math.min(Math.ceil(msgNum / number), page)
          let res = yield call(() => postJSON(
            `${config.SERVER_URL_API_PREFIX}/secretMsg/getMsg`, {
              lastId: 0,
              userId,
              page: 0,
              number: currentPage * number
            }))
          let { data: { code, body } } = res
          if (code === 100) {
            let pageStart = (currentPage - 1) * number
            msgs = body.slice(pageStart, pageStart + number)

            let itemUniqueKey = item => item.type === 1 ? item.senderId : item.receiverId
            msgs = setItemsBgColor(msgs, itemUniqueKey)
            newState = { msgs, currentPage, total, loading: false }
          } else {
            newState = { loading: false, error: true }
          }
        }
      } else {
        newState = { loading: false, error: true }
      }
      yield put({
        type: 'setState',
        payload: newState
      })
    },
    *setMsgRead({ payload }, { call, put, select }) {
      let { msgId, setReadImmediately, successCallback } = payload
      yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/setSecretMsgRead`, {
          secretMsgId: String(msgId)
        }))
      let unReadNum = yield select(state => state.privateMsg.unReadNum)

      yield put({
        type: 'setState',
        payload: {
          unReadNum: unReadNum - 1
        }
      })
      if (successCallback) successCallback()
      if (setReadImmediately) {
        yield put({
          type: 'setItem',
          payload: {
            key: 'msgs',
            itemFilter: item => item.id === msgId,
            newItem: {
              isRead: true
            }
          }
        })
      }
    },
    *setAllMsgRead({ payload }, { call, put }) {
      let { userId, successCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/setAllSecretMsgRead`, {
          userId
        }))
      let { data: { code } } = res
      if (code === 100) {
        yield put({
          type: 'setAllItems',
          payload: {
            key: 'msgs',
            newItem: {
              isRead: true
            }
          }
        })
        yield put({
          type: 'setState',
          payload: { unReadNum: 0 }
        })
        if (successCallback) successCallback()
      }
    },
    *reply({ payload }, { call }) {
      let { senderId, receiverId, msgId, content, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/replySecretMsg`, {
          senderId, receiverId,
          replyId: msgId,
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
    *deleteMsg({ payload }, { call }) {
      let { msgId, type, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/deleteMsgRecord`, {
          secretMsgId: msgId,
          type // 如果是发送者，type传0，否则传1
        }))
      let { data: { code } } = res
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    }
  }
}
