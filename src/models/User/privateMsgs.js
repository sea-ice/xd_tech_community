import { postJSON, setItemsBgColor } from "utils"
import config from 'config/constants'

export default {
  namespace: 'privateMsg',
  state: {},
  reducers: {},
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
    *getPageData({ payload }, { all, call, put }) {
      let { userId, page, number } = payload

      let newInfo = yield (yield put({
        type: 'msgs/getSingleTypeMsgPageData',
        payload: {
          msgType: 'privateMsgs',
          getTotalNumURL: `${config.SERVER_URL_API_PREFIX}/secretMsg/getMsgNum`,
          getPageDataURL: `${config.SERVER_URL_API_PREFIX}/secretMsg/getMsg`,
          userId,
          page,
          number
        }
      }))

      let { msgs } = newInfo
      if (msgs && msgs.length) {
        let itemUniqueKey = item => item.type === 1 ? item.senderId : item.receiverId
        msgs = setItemsBgColor(msgs, itemUniqueKey)
        newInfo = Object.assign(newInfo, { msgs })
      }
      yield put({
        type: 'msgs/setInfo',
        payload: {
          key: 'privateMsgs',
          newInfo
        }
      })
    },
    *setMsgRead({ payload }, { call, put, select }) {
      let { msgId, userId, setReadImmediately, successCallback } = payload
      yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/secretMsg/setSecretMsgRead`, {
          secretMsgId: String(msgId)
        }))

      // 更新未读消息数量
      yield put({
        type: 'msgs/getUnreadNumber',
        payload: { userId }
      })
      if (successCallback) successCallback()
      if (setReadImmediately) {
        yield put({
          type: 'msgs/setMsgItem',
          payload: {
            msgType: 'privateMsgs',
            itemFilter: item => item.id === msgId,
            newItem: { isRead: true }
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
          type: 'msgs/setAllMsgItems',
          payload: {
            msgType: 'privateMsgs',
            newItem: { isRead: true }
          }
        })

        // 更新未读消息数量
        yield put({
          type: 'msgs/getUnreadNumber',
          payload: { userId }
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
