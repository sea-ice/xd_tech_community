import { request, postJSON, safeCallback } from "utils"
import config from 'config/constants'

let searchUserTask = null

export default {
  namespace: 'author',
  state: {
    authorInfo: {},
    validAuthorId: null,
    sharePosts: { posts: [], currentPage: 0, total: 0 },
    appealPosts: { posts: [], currentPage: 0, total: 0 },
    followedUsers: { users: [], currentPage: 0, total: 0 },
    followingUsers: { users: [], currentPage: 0, total: 0 }
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
      let { userId, authorId, successCallback, failCallback } = payload
      let res = yield call(() => request(
        `${config.SERVER_URL_API_PREFIX}/user/other/detail?myId=${userId || authorId}&otherId=${authorId}`
      ))
      let { data: { code, body } } = res
      if (code === 100) {
        yield* safeCallback(successCallback, body)
      } else {
        if (failCallback) yield* safeCallback(failCallback)
      }
    },
    *checkAuthorExists({ payload }, { call, put }) {
      let { authorId, loginUserId } = payload

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
    },
    *getFollowUserList({ payload }, { call, put, fork, cancel, cancelled }) {
      let { followed } = payload
      // 先获取当前用户的关注者人数或者关注该用户的人数
      let stateKey = followed ? 'followedUsers' : 'followingUsers'
      if (!!searchUserTask) {
        yield cancel(searchUserTask)
      }
      searchUserTask = yield fork(getFollowUserList, payload)
      function* getFollowUserList({ authorId, followed, page, number, keywords }) {
        try {
          yield put({
            type: 'setInfo',
            payload: {
              key: stateKey,
              newInfo: { loading: true }
            }
          })
          if (!!keywords) {
            let url = `${config.SERVER_URL_API_PREFIX}/focus/search${followed ? 'Fans' : 'Focus'}ByKeyWords`
            let searchResult = yield call(() => postJSON(url, {
              userId: authorId,
              keyword: keywords,
              page: 0,
              lastId: 0,
              number: 9999
            }))
            console.log(`search Result:`)
            console.log(searchResult)
            searchUserTask = null
            let { data: { code, body } } = searchResult
            let newInfo
            if (code === 100) {
              newInfo = { loading: false, searchError: null, searchResult: body, searchKeywords: keywords }
            } else if ((code === 0) && (body === 216)) {
              newInfo = { loading: false, searchError: null, searchResult: [], searchKeywords: keywords }
            } else {
              newInfo = { loading: false, searchError: true, searchResult: null, searchKeywords: keywords }
            }
            yield put({
              type: 'setInfo',
              payload: {
                key: stateKey,
                newInfo
              }
            })
          } else {
            yield put({
              type: 'getAuthorFollowState',
              payload: {
                authorId, // 注意这里的authorId是当前正在访问的个人主页对应的用户id
                *successCallback(body) {
                  let { fans, focus } = body
                  let followTotal = followed ? fans : focus
                  let newState
                  if (followTotal) {
                    let currentPage = Math.min(Math.ceil(followTotal / number), page)
                    let url = `${
                      config.SERVER_URL_API_PREFIX
                      }/user/${
                      followed ? 'fans' : 'focus'
                      }?userId=${authorId}&lastId=0&number=${currentPage * number}&type=1`
                    let res = yield call(() => request(url))
                    let { data: { code, body } } = res
                    if (code === 100) {
                      let pageStart = (currentPage - 1) * number
                      newState = { loading: false, users: body.slice(pageStart), currentPage, total: followTotal }
                    } else {
                      newState = { loading: false, error: true }
                    }
                  } else {
                    newState = { loading: false, users: [], currentPage: 0, total: 0 }
                  }
                  searchUserTask = null
                  yield put({
                    type: 'setState',
                    payload: {
                      [stateKey]: newState
                    }
                  })
                },
                *failCallback() {
                  searchUserTask = null
                  yield put({
                    type: 'setState',
                    payload: {
                      [stateKey]: { loading: false, error: true }
                    }
                  })
                }
              }
            })
          }
        } finally {
          if (yield cancelled()) {
            console.log(`search ${keywords} task cancelled`)
            yield put({
              type: 'setInfo',
              payload: {
                key: stateKey,
                newInfo: { loading: false }
              }
            })
          }
        }
      }
    },
    *clearSearchResult({ payload }, { put, cancel }) {
      let { followed } = payload
      let stateKey = followed ? 'followedUsers' : 'followingUsers'
      yield put({
        type: 'setInfo',
        payload: {
          key: stateKey,
          newInfo: {
            searchResult: null,
            searchKeywords: ''
          }
        }
      })
      if (!!searchUserTask) {
        yield cancel(searchUserTask)
      }
    }
  }
}
