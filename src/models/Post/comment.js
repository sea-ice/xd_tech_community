import { postJSON } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'comment',
  state: {
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
    }
  },
  effects: {
    *publishComment({ payload }, { all, call, put }) {
      let { objectId, reply, userId, content, successCallback, failCallback, total } = payload
      let version = reply ? 2 : 1
      let url = `${config.SERVER_URL_API_PREFIX}/commentsv${version}/submitCommentsv${version}`
      let params = {
        userId,
        time: '' + Date.now(),
        content
      }
      params[reply ? 'commentId' : 'articleId'] = objectId
      let res = yield call(() => postJSON(url, params))

      let { data: { code, body } } = res
      console.log(body)
      if (code === 100) {
        successCallback()
        reply ? (
          yield put({
            type: 'getAllReplies',
            payload: {
              commentId: objectId,
              total
            }
          })
        ) : (
          yield put({
            type: 'getAllComments',
            payload: {
              postId: objectId,
              total
            }
          })
        )
      } else {
        failCallback()
      }
    },
    *getReplies({ payload }, { call, put }) {
      let { commentId, page, number, loadedNumber } = payload
      let itemFilter = (item) => item.commentsv1Id === commentId
      if (loadedNumber && Math.ceil(loadedNumber / number) > page) {
        yield put({
          type: 'postDetails/setItem',
          payload: {
            key: 'comments',
            itemFilter,
            newItem: {
              replyCurrentPage: page
            }
          }
        })
        return
      }
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/commentsv2/getCommentsv2/Update`, {
          lastId: 0,
          id: commentId,
          page,
          number: page * number
        }))
      let { data: { code, body } } = res
      console.log(body)
      if (code === 100) {
        body = body.map(item => Object.assign(item, {
          commentsv1Id: commentId
        }))
        yield put({
          type: 'postDetails/setItem',
          payload: {
            key: 'comments',
            itemFilter,
            newItem: {
              replyCurrentPage: page,
              replies: body
            }
          }
        })
      }
    },
    *getAllComments({ payload }, { call, put }) {
      let { postId, total } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/commentsv1/getCommentsv1/Update`, {
        id: postId,
        page: 0, // page不起作用，但需要传
        lastId: 0, // 始终从头开始加载，不记录每次分页的最后一条评论的id
        number: total
      }))
      let { data: { code, body } } = res
      if (code === 100) {
        yield put({
          type: 'postDetails/setState',
          payload: {
            comments: body
          }
        })
        yield put({
          type: 'postDetails/setInfo',
          payload: {
            key: 'postInfo',
            newInfo: {
              commentNum: total // 更新评论数量
            }
          }
        })
      }
    },
    *getAllReplies({ payload }, { call, put }) {
      let { commentId, total } = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/commentsv2/getCommentsv2/Update`, {
          lastId: 0,
          id: commentId,
          page: 0,
          number: total
        }))
      let { data: { code, body } } = res
      console.log(body)
      if (code === 100) {
        body = body.map(item => Object.assign(item, {
          commentsv1Id: commentId
        }))
        yield put({
          type: 'postDetails/setItem',
          payload: {
            key: 'comments',
            itemFilter: item => item.commentsv1Id === commentId,
            newItem: {
              commentNum: total,
              replies: body
            }
          }
        })
      }
    },
    *updateReplyAcceptState({ payload }, { call, put }) {
      let { commentsv1Id, commentsv2Id, comments } = payload
      let targetContainer
      let targetIndex = comments.findIndex(item => item.commentsv1Id === commentsv1Id)
      let saveUpdateCommentIndex
      comments = comments.slice()
      if (commentsv2Id) {
        // 更新评论的评论
        saveUpdateCommentIndex = targetIndex
        targetContainer = targetContainer[targetIndex].replies
        targetIndex = targetContainer.findIndex(item => item.commentsv2Id === commentsv2Id)
      } else {
        // 更新顶层评论
        targetContainer = comments
      }
      let target = targetContainer[targetIndex]
      let { isAccept, approvalNum } = target
      targetContainer.splice(targetIndex, 1, Object.assign(
        {}, target, {
          isAccept: !isAccept,
          approvalNum: isAccept ? (approvalNum - 1) : (approvalNum + 1)
        }))
      if (saveUpdateCommentIndex !== undefined) {
        comments[saveUpdateCommentIndex].replies = targetContainer.slice()
      }
      console.log(comments)
      yield put({
        type: 'postDetails/setState',
        payload: {
          comments
        }
      })
    }
  }
}
