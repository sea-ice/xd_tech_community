import { postJSON } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'postCURD',
  state: {
    postInfo: {},
    authorInfo: {},
    comments: [],
    commentCurrentPage: 1
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *delete({ payload }, { all, call, put }) {
      let { userId, postId, successCallback, failCallback } = payload

      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/article/doDelete`, {
          userId,
          articleId: postId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    },
  }
}
