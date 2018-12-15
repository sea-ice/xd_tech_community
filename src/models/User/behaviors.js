import {
  routerRedux
} from "dva/router";

import {
  request,
  postJSON
} from "utils"
import config from 'config/constants'
import {
  hasStorageKey
} from 'utils'

export default {
  namespace: 'userBehaviors',
  state: {},
  reducers: {

  },
  effects: {
    *approval({ payload }, { call, put }) {
      let { type, objectId, userId, state, successCallback, failCallback } = payload
      let url = `/api/approval/${state ? 'doApproval' : 'cancelApproval'}`
      let params = { type, objectId, userId }
      if (state) params.time = '' + Date.now()

      try {
        let res = yield call(() => postJSON(url, params))
        let { data: { code } } = res
        if (code === 100) {
          successCallback()
        } else {
          failCallback()
        }
      } catch (e) {
        failCallback()
      }
    },
    *collectPost({payload}, {call,put}) {
      let { userId, postId, collectionName, cancel } = payload
      if (!cancel) {
        yield call(() => postJSON('/api/favorite/doFavorite', {
          userId, postId,
          favoriteDir: collectionName
        }))
      } else {
        // 取消收藏需要先获取帖子所在的收藏夹
        let target = yield call(() => postJSON(
          '/api/favorite/getFavoriteDirInfo', {
            userId,
            postId
          }))
        console.log(target)
      }

    },
    *followAuthor({ payload }, { call, put }) {
      let { userId, authorId, state, successCallback, failCallback } = payload
      let url = '/api/focus'
      let params = {
        from: userId,
        to: authorId,
        time: '' + Date.now()
      }
      let res = yield call(() => state ?
        postJSON(url, params) :
        request(url, {
          method: 'DELETE',
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          }
        })
      )

      let { data: { code } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    },
    *isLikedOrNot({ payload }, { call, put }) {
      let { type, objectId, userId } = payload
      let res = yield call(() => postJSON(
        '/api/approval/getApproval', {
          type, objectId, userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'postDetails/setInfo',
          payload: {
            key: 'postInfo',
            newInfo: {liked: !!body.flag}
          }
        })
      }
    },
    *isCollectedOrNot({ payload }, { call, put }) {
      let { type, objectId, userId } = payload
      let res = yield call(() => postJSON(
        '/api/favorite/getFavorite', {
          type, objectId, userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'postDetails/setInfo',
          payload: {
            key: 'postInfo',
            newInfo: { collected: !!body.flag }
          }
        })
      }
    },
    *hasFollowAuthorOrNot({ payload }, { call, put }) {

    }
  }
}
