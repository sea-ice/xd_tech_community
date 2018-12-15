import { postJSON } from "utils"
import {fillPostListPayload} from 'utils'

export default {
  namespace: 'recommendPosts',
  state: {
    share: [],
    help: [],
    sharePostPage: 0,
    helpPostPage: 0
  },
  reducers: {
    putNextPage(state, {payload}) {
      let {posts, postType, reset} = payload
      let pageKey = `${postType}PostPage`

      return Object.assign({}, state, {
        [postType]: reset ? posts : state[postType].concat(posts),
        [pageKey]: state[pageKey] + 1
      }, reset ? {
        sharePostPage: 1,
        helpPostPage: 1
      } : {})
    }
  },
  effects: {
    *getPageData({payload}, {call, put}) {
      let {url, postType, params, reset} = payload
      let posts = yield call(() => postJSON(url, params))
      let { data: { code, body } } = posts
      // console.log('----')
      // console.log(body)
      // console.log('----')
      if (code === 100) {
        yield put({
          type: 'putNextPage',
          payload: {
            posts: body,
            postType,
            reset
          }
        })
        return true
      } else {
        console.log(new Error('获取分页数据失败'))
        return false
      }
    },
    *getPostByNewTags ({payload}, {all, put}) {
      let {userInfo, tags} = payload
      yield put({
        type: 'postFilterState/setState',
        payload: { confirmState: 'loading' }
      })
      // 同步刷新分享帖和求助帖列表
      let res = yield all([
        put({
          type: 'getPageData',
          payload: {
            ...fillPostListPayload(userInfo, 'share', 0, tags),
            reset: true
          }
        }),
        put({
          type: 'getPageData',
          payload: {
            ...fillPostListPayload(userInfo, 'help', 0, tags),
            reset: true
          }
        })
      ]) // 返回的res是由两个Promise对象构成的数组
      res = yield Promise.all(res)
      console.log(res)
      if (res[0] && res[1]) {
        yield put({
          type: 'postFilterState/setState',
          payload: {
            confirmState: 'confirmed',
            selectedTags: tags,
            confirmedTags: tags.slice()
          }
        })
      } else {
        yield put({
          type: 'postFilterState/setState',
          payload: { confirmState: 'waitConfirm' }
        })
      }
    }
  }
}
