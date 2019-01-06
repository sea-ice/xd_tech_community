import { postJSON, getFormatPostFields } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'postCURD',
  state: {
    postInfo: {},
    authorInfo: {},
    comments: [],
    commentCurrentPage: 1,
    editPost: { // 当前正在编辑的帖子状态，title和content由Publish组件单独维护，不保存在store中
      articleId: null,
      type: config.postType.SHARE, // 分享帖或求助帖两种，具体细分需要根据setShareCoins和setAppealCoins来判断
      selectedTags: [],
      setShareCoins: false, // 分享帖是否散金币
      setAppealCoins: false, // 求助帖是否散金币
      coinsForAcceptedUser: 0,
      coinsPerJointUser: 0,
      jointUsers: 0
    }, // 以上这些值即新建帖子时的初始值，在修改帖子的时候需要设置，新建帖子时需要重置
    newPostFlag: false, // 新建帖子的标志
    validDraftId: null,
    draftSaveState: 'initial', // 'unsaved' 'saving' 'error' 'success'
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
    *delete({ payload }, { all, call, put }) {
      let { userId, postId, successCallback, failCallback } = payload

      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/article/doDelete`, {
          userId,
          articleId: postId
        }))
      let { data: { code } } = res
      if (code === 100) {
        successCallback()
      } else {
        failCallback()
      }
    },
    *checkDraftExists({ payload }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { validDraftId: null }
      })
      let { authorId, draftId } = payload // authorId为当前登录的用户id

      yield call(() => postJSON()) // 检测当前用户是否对草稿具有编辑权限的接口，如果有，需要返回草稿的信息
      // 如果有编辑权限，需要将草稿的信息设置到editPost对象上（包括title、content这两个属性也需要设置）
      // 同时需要更新validDraftId
    },
    *saveDraft({ payload }, { call, put }) {
      yield put({
        type: 'setState',
        payload: { draftSaveState: 'saving' }
      })
      payload = getFormatPostFields(payload)

      let { articleId, ...rest } = payload
      let url = `${
          config.SERVER_URL_API_PREFIX
        }/article/${
          !!articleId ? 'updateArticleDraft' : 'saveArticleDraft'
        }`
      let params = !!articleId ? payload : rest
      let res = yield call(() => postJSON(url, params))
      let { data: { code } } = res
      if (code === 100) {
        // todo: 如果是初次保存草稿，需要设置editPost中的articleId
        console.log(res)
        yield put({
          type: 'setState',
          payload: { draftSaveState: 'success' }
        })
      } else {
        yield put({
          type: 'setState',
          payload: { draftSaveState: 'error' }
        })
      }
    },
    *publish({ payload }, { call, put }) {
      let { successCallback, failCallback } = payload
      payload = getFormatPostFields(payload)

      let { articleId, ...rest } = payload
      // todo:发表帖子接口后面需要换成发表草稿的接口
      let res = yield call(() => postJSON(`${config.SERVER_URL_API_PREFIX}/article/publish`, rest))
      let { data: { code } } = res
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    }
  }
}
