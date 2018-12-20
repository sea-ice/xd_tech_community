import { postJSON } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'postDetails',
  state: {
    postInfo: {},
    authorInfo: {},
    comments: [],
    commentCurrentPage: 1
  },
  reducers: {
    setState(state, {payload}) {
      return Object.assign({}, state, payload)
    },
    setInfo(state, { payload }) {
      let { key, newInfo } = payload
      let info = Object.assign({}, state[key], newInfo)
      return Object.assign({}, state, {
        [key]: info
      })
    },
    setItem(state, { payload }) {
      let { key, itemFilter, newItem } = payload
      let items = state[key].slice()
      let itemIdx = items.findIndex(itemFilter)
      if (~itemIdx) {
        let item = Object.assign({}, items[itemIdx], newItem)
        items.splice(itemIdx, 1, item)
        return Object.assign({}, state, {
          [key]: items
        })
      } else {
        return state
      }
    },
    reset(state) {
      return Object.assign({}, state, {
        postInfo: {},
        authorInfo: {},
        comments: []
      })
    }
  },
  effects: {
    *getDetails({payload}, {all, call, put}) {
      let { id, userInfo } = payload

      if (userInfo) {
        // 对于已登录用户，获取帖子是否被当前用户赞同，收藏
        let { userId } = userInfo
        let payload = { type: 0, userId, objectId: id }
        yield put({
          type: 'userBehaviors/isLikedOrNot',
          payload
        }) // put不阻塞后面的操作，dispatch action之后立即返回，返回值为Promise对象
        yield put({
          type: 'userBehaviors/isCollectedOrNot',
          payload
        })
      }
      let details = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/article/getArticleDetails`,
        { id }
      ))
      console.log('details')
      console.log(details)
      let { data: { code, body } } = details
      if (code === 100) {
        yield put({
          type: 'setInfo',
          payload: {
            key: 'postInfo',
            newInfo: body
          }
        })
        return body
      }
    },
    *updateAuthorFollowState({ payload }, { put }) {
      let { userId, authorId } = payload
      yield put({
        type: 'author/getAuthorFollowState',
        payload: {
          userId, authorId,
          *successCallback(res) {
            yield put({
              type: 'setInfo',
              payload: {
                key: 'authorInfo',
                newInfo: {
                  relationship: res.status
                }
              }
            })
          }
        }
      })
    },
    *getAuthorInfo({payload}, {call, put}) {
      let { authorId, userInfo } = payload
      let authorInfo = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/user/getUserInfo`, {
          userId: authorId
        }))
      console.log('hello')
      console.log(userInfo)
      if (userInfo) {
        // 对于已登录用户，获取是否已关注当前作者
        let { userId } = userInfo
        yield put({
          type: 'updateAuthorFollowState',
          payload: { userId, authorId }
        })
      }
      let { data: { code, body } } = authorInfo
      if (code === 100) {
        console.log(body)
        yield put({
          type: 'setState',
          payload: {
            authorInfo: Object.assign(body, {
              relationship: config.author.NO_RELATIONSHIP
            })
          }
        })
        return body
      }
    },
    *getComments({ payload }, { call, put }) {
      let { postId, page, number, loadedNumber } = payload
      if (loadedNumber && (Math.ceil(loadedNumber / number) >= page)) {
        yield put({
          type: 'setState',
          payload: { commentCurrentPage: page } // 更新当前page
        })
        return
      }
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/commentsv1/getCommentsv1/Update`, {
        id: postId,
        page, // page不起作用，但需要传
        lastId: 0, // 始终从头开始加载，不记录每次分页的最后一条评论的id
        number: page * number
      }))
      let { data: { code, body } } = res
      console.log('comments')
      console.log(body)
      if (code === 100) {
        yield put({
          type: 'setState',
          payload: {
            comments: body,
            commentCurrentPage: page
          }
        })
      }
    }
  }
}
