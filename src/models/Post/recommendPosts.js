import { postJSON } from "utils"
import {fillPostListPayload} from 'utils'

export default {
  namespace: 'recommendPosts',
  state: {
    firstLoading: true,
    share: [],
    appeal: [],
    sharePostPage: 0,
    appealPostPage: 0
  },
  reducers: {
    putNextPage(state, { payload }) {
      let { posts, postType, reset } = payload
      let pageKey = `${postType}PostPage`

      return Object.assign({}, state, {
        [postType]: reset ? posts : state[postType].concat(posts),
        [pageKey]: state[pageKey] + 1
      }, reset ? {
        sharePostPage: 1,
        appealPostPage: 1
      } : {})
    },
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *getPageData({ payload }, { call, put }) {
      let { url, postType, params, reset, successCallback } = payload
      let posts = yield call(() => postJSON(url, params))
      let { data: { code, body } } = posts
      if (code === 100) {
        yield put({
          type: 'putNextPage',
          payload: {
            posts: body,
            postType,
            reset
          }
        })
        if (successCallback) successCallback(posts)
        return true
      } else if (code === 216) {
        if (successCallback) successCallback(posts)
      }
      return false
    },
    *getPostByNewTags({ payload }, { all, put }) {
      let { userInfo, tags, successCallback } = payload
      yield put({
        type: 'postFilterState/setState',
        payload: { confirmState: 'loading' }
      })
      // 同步刷新分享帖和求助帖列表
      let res = yield (yield all([
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
            ...fillPostListPayload(userInfo, 'appeal', 0, tags),
            reset: true
          }
        })
      ]))
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
        if (successCallback) successCallback()
      } else {
        yield put({
          type: 'postFilterState/setState',
          payload: { confirmState: 'waitConfirm' }
        })
      }
    }
  }
}
