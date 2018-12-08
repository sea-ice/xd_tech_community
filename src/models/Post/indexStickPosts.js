export default {
  namespace: 'indexStickPosts',
  state: {
    share: [],
    help: []
  },
  reducers: {
    putNextPage(state, {payload}) {
      let {posts, postType} = payload
      return Object.assign({}, state, {
        [postType]: state[postType].concat(posts)
      })
    }
  },
  effects: {
    *getPageData({payload}, {call, put}) {
      let {postType} = payload
      let posts = yield call(() => {}, payload)
      yield put({
        type: 'putNextPage',
        payload: {posts, postType}
      })
    }
  }
}
