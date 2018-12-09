import { request } from "utils"

export default {
  namespace: 'indexStickPosts',
  state: {
    share: [],
    help: []
  },
  reducers: {
    putNextPage(state, {payload}) {
      let {posts, postType} = payload
      console.log('stick')
      console.log(posts)
      return Object.assign({}, state, {
        [postType]: state[postType].concat(posts)
      })
    }
  },
  effects: {
    *getPageData({payload}, {call, put}) {
      let {url, postType} = payload
      let posts = yield call(() => request(url))
      console.log(posts)
      let {data: {code, body}} = posts
      if (code === 100) {
        yield put({
          type: 'putNextPage',
          payload: {posts: body, postType}
        })
      } else {
        console.log(new Error('获取分页数据失败'))
      }
    }
  }
}
