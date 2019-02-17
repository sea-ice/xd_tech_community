import { postJSON, setItemsBgColor } from "utils"
import config from 'config/constants'

export default {
  namespace: 'sysMsgs',
  state: {},
  reducers: {},
  effects: {
    *getPageData({ payload }, { all, call, put }) {
      let { userId, page, number } = payload

      let newInfo = yield (yield put({
        type: 'msgs/getSingleTypeMsgPageData',
        payload: {
          msgType: 'sysMsgs',
          getTotalNumURL: `${config.SERVER_URL_API_PREFIX}/push/getSystemNotifyNum`,
          getPageDataURL: `${config.SERVER_URL_API_PREFIX}/push/getSystemNotifyList`,
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
          key: 'sysMsgs',
          newInfo
        }
      })
    },
    *setMsgRead({ payload }, { call, put, select }) {
      let { msgId, userId, setReadImmediately, successCallback } = payload
      yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/push/setSystemNotifyRead`, {
          userId,
          systemNotifyId: msgId
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
            msgType: 'sysMsgs',
            itemFilter: item => item.id === msgId,
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
            msgType: 'sysMsgs',
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
    /* 系统消息删除功能待确定 */
    *deleteMsg({ payload }, { call }) {
      let { msgId, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        /* 接口待确定 */
        `${config.SERVER_URL_API_PREFIX}`, {
          notify: msgId
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
