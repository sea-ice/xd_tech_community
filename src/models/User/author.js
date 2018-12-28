import { request, postJSON, safeCallback } from "utils"
import config from 'config/constants'

export default {
  namespace: 'author',
  state: {
    authorInfo: {},
    checkingAuthorId: true,
    validAuthorId: null,
    sharePosts: { posts: [], currentPage: 0, total: 0 },
    appealPosts: { posts: [], currentPage: 0, total: 0 },
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
  },
  effects: {
    *getAuthorFollowState({ payload }, { call, put }) {
      let { userId, authorId, successCallback } = payload
      let res = yield call(() => request(
        `${config.SERVER_URL_API_PREFIX}/user/other/detail?myId=${userId}&otherId=${authorId}`
      ))
      let { data: { code, body } } = res
      if (code === 100) {
        yield* safeCallback(successCallback, body)
      }
    },
    *checkAuthorExists({ payload }, { call, put }) {
      let { authorId, loginUserId, validAuthorId } = payload
      if (validAuthorId === authorId) return
      yield put({
        type: 'setState',
        payload: { checkingAuthorId: true }
      })
      let res = yield call(() => request(
        `${
          config.SERVER_URL_API_PREFIX
        }/user/other/detail?myId=${loginUserId || authorId}&otherId=${authorId}`
      ))
      console.log(res)
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'setState',
          payload: {
            checkingAuthorId: false,
            validAuthorId: authorId,
            authorInfo: { userId: authorId, ...body },
            sharePosts: { posts: [], currentPage: 0, total: 0, loading: false },
            appealPosts: { posts: [], currentPage: 0, total: 0, loading: false },
          }
        })
      } else {
        yield put({
          type: 'setState',
          payload: {
            checkingAuthorId: false,
            validAuthorId: false, // 值为false表示用户不存在
          }
        })
      }
    },
    *getAuthorPosts({ payload }, { call, put }) {
      let { type, authorId, page, number } = payload
      // 设置loading
      yield put({
        type: 'setInfo',
        payload: {
          key: `${type}Posts`,
          newInfo: { loading: true }
        }
      })
      // 先获取当前帖子数量
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/getMyArticleNum`, {
          userId: authorId
        }))
      let { data: { code, body } } = res
      let newInfo
      if (code === 100) {
        let { hArticleNum, sArticleNum } = body
        let articleNum = type === 'share' ? sArticleNum : hArticleNum
        if (!articleNum) {
          // 未发布帖子
          newInfo = { posts: [], currentPage: 0, total: 0, loading: false }
        } else {
          let total = articleNum, posts = []
          let currentPage = Math.min(Math.ceil(articleNum / number), page)
          let res = yield call(() => postJSON(
            `${config.SERVER_URL_API_PREFIX}/article/${
            type === 'share' ? 'getMyShare' : 'getMyHelp'
            }/Update`, {
              lastId: 0,
              userId: authorId,
              page: currentPage, // page不起作用，但需要传
              number: currentPage * number
            }))
          let { data: { code, body } } = res
          if (code === 100) {
            let pageStart = (currentPage - 1) * number
            posts = body.slice(pageStart, pageStart + number)
            newInfo = { posts, currentPage, total, loading: false }
          } else {
            newInfo = { loading: false, error: true }
          }
        }
      } else {
        newInfo = { loading: false, error: true }
      }
      yield put({
        type: 'setState',
        payload: {
          [`${type}Posts`]: newInfo
        }
      })
    },
    *getAuthorLevel({ payload }, { call, put }) {
      let {authorId} = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/getUserTitle`, {
          userId: authorId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'setInfo',
          payload: {
            key: 'authorInfo',
            newInfo: { userLevel: body.replace('userTitle:', '') }
          }
        })
      }
    },
    *saveAuthorInfo({ payload }, { call, put }) {
      let { authorInfo, successCallback } = payload
      let {
        userId,
        avator,
        label,
        nickName,
        gender,
        school,
        education,
        location = '',
        introduction
      } = authorInfo
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/modifyUserInfo`, {
          userId,
          avator,
          label,
          nickName,
          gender: Number(gender),
          school,
          education,
          location,
          introduction
        }))
      let { data: { code } } = res
      if (code === 100) {
        yield put({
          type: 'setInfo',
          payload: {
            key: 'authorInfo',
            newInfo: authorInfo
          }
        })
        if (successCallback) successCallback()
      }
    }
  }
}
