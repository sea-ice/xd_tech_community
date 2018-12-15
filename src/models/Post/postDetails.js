import {postJSON} from 'utils'

export default {
  namespace: 'postDetails',
  state: {
    postInfo: {},
    authorInfo: {},
    comments: []
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
        '/api/article/getArticleDetails',
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
    *getAuthorInfo({payload}, {call, put}) {
      let {userId, userInfo} = payload
      let authorInfo = yield call(() => postJSON(
          '/api/user/getUserInfo', {
          userId
        }))
      if (userInfo) {
        // 对于已登录用户，获取是否已关注当前作者
        let { userId } = userInfo
        // todo: 未找到对应的接口，待确定参数
        yield put({
          type: 'userBehaviors/hasFollowAuthorOrNot',
          payload: {}
        })
      }
      let { data: { code, body } } = authorInfo
      if (code === 100) {
        console.log(body)
        yield put({type: 'setState', payload: {authorInfo: body}})
        return body
      }
    },
    *getComments({ payload }, { call, put }) {
      let { userInfo, postId, page, lastPostId, number } = payload
      let res = yield call(() => postJSON('/api/commentsv1/getCommentsv1/Update', {
        id: postId,
        page,
        lastId: lastPostId,
        number
      }))
      let { data: { code, body } } = res
      if (code === 100) {
        console.log('comments')
        console.log(body)
      }
      if (userInfo) {

      }
    }
  }
}
