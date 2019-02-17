import { postJSON, setItemsBgColor } from "utils"
import config from 'config/constants'

export default {
  namespace: 'userMsgs',
  state: {},
  reducers: {},
  effects: {
    *getPageData({ payload }, { all, call, put }) {
      let { userId, page, number } = payload

      let newInfo = yield (yield put({
        type: 'msgs/getSingleTypeMsgPageData',
        payload: {
          msgType: 'userMsgs',
          getTotalNumURL: `${config.SERVER_URL_API_PREFIX}/push/getUserNotifyNum`,
          getPageDataURL: `${config.SERVER_URL_API_PREFIX}/push/getNotification`,
          userId,
          page,
          number
        }
      }))

      let { msgs } = newInfo
      if (msgs && msgs.length) {
        // let itemUniqueKey = item => item.type === 1 ? item.senderId : item.receiverId
        // msgs = setItemsBgColor(msgs, itemUniqueKey)
        // newInfo = Object.assign(newInfo, { msgs })
      }
      yield put({
        type: 'msgs/setInfo',
        payload: {
          key: 'userMsgs',
          newInfo
        }
      })
    },
    *setMsgRead({ payload }, { call, put, select }) {
      let { msgId, userId, setReadImmediately, successCallback } = payload
      yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/push/setRead`, {
          id: msgId,
          time: '' + Date.now()
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
            msgType: 'userMsgs',
            itemFilter: item => item.object.notificationId === msgId,
            newItem: { isRead: true }
          }
        })
      }
    },
    *setAllMsgRead({ payload }, { call, put }) {
      let { userId, successCallback } = payload
      let res = yield call(() => postJSON(
        /* 接口待确定 */
        `${config.SERVER_URL_API_PREFIX}`, {
          userId
        }))
      let { data: { code } } = res
      if (code === 100) {
        yield put({
          type: 'msgs/setAllMsgItems',
          payload: {
            msgType: 'userMsgs',
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
      let { msgId, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        /* 接口待确定 */
        `${config.SERVER_URL_API_PREFIX}`, {
          secretMsgId: msgId
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
