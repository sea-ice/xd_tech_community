import { request, postJSON, safeCallback } from "utils"
import config from 'config/constants'

export default {
  namespace: 'author',
  state: {
  },
  reducers: {

  },
  effects: {
    *getAuthorFollowState({ payload }, { call, put }) {
      let { userId, authorId, successCallback } = payload
      let res = yield call(() => request(
        `${
          config.SERVER_URL_API_PREFIX
        }/user/other/detail?myId=${userId}&otherId=${authorId}`
      ))
      let { data: { code, body } } = res
      if (code === 100) {
        yield safeCallback(successCallback, body)
      }
    }
  }
}
