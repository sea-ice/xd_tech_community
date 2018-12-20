import {
  request,
  postJSON
} from "utils"
import config from 'config/constants'

export default {
  namespace: 'userBehaviors',
  state: {},
  reducers: {

  },
  effects: {
    *approval({ payload }, { call, put }) {
      let { type, objectId, userId, like, successCallback, failCallback } = payload
      let url = `${config.SERVER_URL_API_PREFIX}/approval/${like ? 'doApproval' : 'cancelApproval'}`
      let params = { type, objectId, userId }
      if (like) params.time = '' + Date.now()

      try {
        let res = yield call(() => postJSON(url, params))
        let { data: { code } } = res
        console.log(res)

        if (code === 100) {
          successCallback()
        } else {
          failCallback()
        }
      } catch (e) {
        failCallback()
      }
    },
    *collectPost({ payload }, { call, put }) {
      // favoriteDir仅在收藏帖子的时候需要，取消收藏不需要传
      let { userId, postId, favoriteDir, cancel, successCallback, failCallback } = payload
      if (!cancel) {
        // 收藏帖子
        let res = yield call(() => postJSON(
          `${config.SERVER_URL_API_PREFIX}/favorite/doFavorite`, {
            userId, postId, favoriteDir
          }
        ))
        let { data: { code, body } } = res
        if (code === 100) {
          successCallback()
        } else {
          failCallback()
        }
      } else {
        // 取消收藏需要先获取帖子所在的收藏夹
        let res = yield call(() => postJSON(
          `${config.SERVER_URL_API_PREFIX}/favorite/getFavoriteDirInfo`, {
            userId,
            postId
          }))
        let { data: { code, body } } = res
        if (code === 100) {
          let collection = body.find(item => !!item.flag)
          let { favoriteDir } = collection
          let res = yield call(() => postJSON(
            `${config.SERVER_URL_API_PREFIX}/favorite/cancelFavorite`, {
              articleId: postId,
              userId, favoriteDir
            }))
          let { data: { code } } = res
          if (code === 100) {
            successCallback()
          } else {
            failCallback()
          }
        } else {
          failCallback()
        }

      }

    },
    *followAuthor({ payload }, { call, put }) {
      let { userId, authorId, follow, successCallback, failCallback } = payload
      let url = `${config.SERVER_URL_API_PREFIX}/focus`
      let params = {
        from: userId,
        to: authorId,
        time: '' + Date.now()
      }
      let res = yield call(() => follow ?
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
        `${config.SERVER_URL_API_PREFIX}/approval/getApproval`, {
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
        `${config.SERVER_URL_API_PREFIX}/favorite/getFavorite`, {
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
    *reportUser({payload}, {call}) {
      let {
        objectId, objectType,
        userId, reason,
        successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/accusation/doAccusation`, {
          type: objectType,
          objectId,
          userId,
          reason,
          time: '' + Date.now()
        }))
      let { data: { code } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    }
  }
}
