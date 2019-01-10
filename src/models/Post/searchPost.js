/*
* @Author: Jackhzh
* @Date:   2019-01-04 20:59:20
* @Last Modified by:   Jackhzh
* @Last Modified time: 2019-01-09 19:51:09
*/
import { postJSON } from "utils"
import config from 'config/constants'

export default {
  namespace: 'searchPost',
  state: {
    searchKeyword: '',
    searchResults: []
  },
  reducers: {
    putNextPage(state, { payload }) {
      let { pageData, reset } = payload

      return Object.assign({}, state, {
        searchResults: !!reset ?
          pageData : state.searchResults.concat(pageData),
      })
    },
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    }
  },
  effects: {
    *getPageData({ payload }, { call, put }) {
      let {
        reset, userId,
        page, number, keyword,
        successCallback, failCallback
      } = payload

      let posts = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/article/doSearch`, {
          page,
          userId,
          label: '',
          number,
          keyword
        }))
      let { data: { code, body } } = posts

      if ((code === 100) || (code === 214)) {
        // 加载成功或者没有数据
        yield put({
          type: 'putNextPage',
          payload: {
            pageData: body || [],
            reset
          }
        })
        if (successCallback) successCallback(posts)
      } else if (code === 216) {
        // 没有更多数据
        if (successCallback) successCallback(posts)
      } else {
        if (failCallback) failCallback()
      }
    },
  }
}


