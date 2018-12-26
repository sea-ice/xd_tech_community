import { postJSON, setItemsBgColor } from "utils"
import config from 'config/constants'

export default {
  namespace: 'privateMsg',
  state: {
    loading: false, // 加载分页数据时的loading
    total: 0, // 包括已读和未读
    msgs: [],
    currentPage: 0,
    unReadNum: 0
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
    *getUnReadNumber({ payload }, { call, put }) {
      let { userId } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/getNotReadMsgNum`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'setState',
          payload: { unReadNum: body }
        })
        return body
      }
    },
    *getPageData({ payload }, { all, call, put }) {
      let { userId, page, number } = payload
      // 设置loading
      yield put({
        type: 'setState',
        payload: { loading: true }
      })
      // 每一次获取分页消息之前都先获取当前私信的总条数
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
              page: currentPage - 1,
              number: number
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
    *setMsgRead({ payload }, { call, put }) {
      let { msgId, setReadImmediately, successCallback } = payload
      yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/setSecretMsgRead`, {
          secretMsgId: msgId
        }))
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
