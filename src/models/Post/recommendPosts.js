import { request } from "utils"

export default {
  namespace: 'recommendPosts',
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
      let getPageData = ({url, ...params}) => request(url, {
        method: 'POST',
        body: params
      })
      let posts = yield call(getPageData, payload)
      yield put({
        type: 'putNextPage',
        payload: {posts, postType}
      })
    }
  }
}
