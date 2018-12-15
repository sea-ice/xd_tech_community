import { postJSON } from 'utils'

export default {
  namespace: 'comment',
  state: {
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
    reset(state) {
    }
  },
  effects: {
    *publishComment({ payload }, { all, call, put }) {
      let { postId, userId, content, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        '/api/commentsv1/submitCommentsv1', {
          articleId: postId,
          userId,
          time: '' + Date.now(),
          content
        }))

      let { data: { code, body } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    },
    *getAuthorInfo({ payload }, { call, put }) {

    },
    *getComments({ payload }, { put }) {

    }
  }
}
