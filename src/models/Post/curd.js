import { postJSON } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'postCURD',
  state: {
    postInfo: {},
    authorInfo: {},
    comments: [],
    commentCurrentPage: 1,
    editPost: { // 当前正在编辑的帖子状态
      type: '0',
      selectedTags: [],
      setShareCoins: false, // 分享帖是否散金币
      setAppealCoins: false, // 求助帖是否散金币
      coinsForAcceptedUser: 0,
      coinsPerJointUser: 0,
      jointUsers: 0
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
  },
  effects: {
    *delete({ payload }, { all, call, put }) {
      let { userId, postId, successCallback, failCallback } = payload

      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/article/doDelete`, {
          userId,
          articleId: postId
        }))
      let { data: { code } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    },
  }
}
