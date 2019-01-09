/*
* @Author: Jackhzh
* @Date:   2019-01-04 20:59:20
* @Last Modified by:   Jackhzh
* @Last Modified time: 2019-01-09 19:51:09
*/
import { postJSON } from "utils"
import { searchListPost } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'searchPost',
  state: {
    firstLoading: true,
    list: [],
    sharePostPage: 0,
    appealPostPage: 0
  },
  reducers: {
    putNextPage(state, { payload }) {
      let { posts } = payload
      state.list = posts
      
      return Object.assign({}, state, payload)
      // return Object.assign({}, state, {
      //   [pageKey]: state[pageKey] + 1
      // }, reset ? {
      //   sharePostPage: 1,
      //   appealPostPage: 1
      // } : {})
    },
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *getPageData({ payload }, { call, put }) {
      let { url, list, params, reset, successCallback } = payload
      let param = {}
      // console.log(typeof payload.userInfo.userId)
      param.userId = payload.userInfo==null ? 0 : payload.userInfo.userId 
      param.keyword = payload.searchKeyword
      param.label = payload.label
      param.page = payload.page
      param.number = config.POSTS_PER_PAGE
      console.log(param)
      let posts = yield call(() => postJSON(`${config.SERVER_URL_API_PREFIX}/article/doSearch`, param))
      let { data: { code, body } } = posts
      // console.log(code)
      if (code === 100) {
        yield put({
          type: 'putNextPage',
          payload: {
            posts: body
          }
        })
        if (successCallback) successCallback(posts)
        return true
      } else if (code === 216) {
        if (successCallback) successCallback(posts)
      }
      return false
    },
  }
}


