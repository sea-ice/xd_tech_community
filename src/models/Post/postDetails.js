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
    }
  },
  effects: {
    *getDetails({payload}, {call, put}) {
      let {id} = payload
      let details = yield call(() => postJSON(
        '/api/article/getArticleDetails',
        { id }
      ))
      // console.log(details)
      let {data: {code, body}} = details
      if (code === 100) {
        yield put({type: 'setState', payload: {postInfo: body}})
        return body
      }
    },
    *getAuthorInfo({payload}, {call, put}) {
      let {userId} = payload
      let authorInfo = yield call(() => postJSON('/api/user/getUserInfo', {
        userId
      }))
      let {data: {code, body}} = authorInfo
      if (code === 100) {
        console.log(body)
        yield put({type: 'setState', payload: {authorInfo: body}})
        return body
      }
    },
    *getComments({payload}, {put}) {

    }
  }
}
