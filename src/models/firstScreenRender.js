import { fillPostListPayload } from 'utils'
import config from 'config/constants'

export default {
  namespace: 'firstScreenRender',
  state: {},
  reducers: {},
  effects: {
    *indexPage({ payload }, { all, put }) {
      let { userInfo } = payload

      yield (yield all([
        put({ // 推荐分享帖
          type: 'recommendPosts/getPageData',
          payload: fillPostListPayload(
            userInfo, 'share', 0, userInfo && userInfo.label.split(','))
        }),
        put({ // 推荐求助帖
          type: 'recommendPosts/getPageData',
          payload: fillPostListPayload(
            userInfo, 'appeal', 0, userInfo && userInfo.label.split(','))
        }),
        // put({ // 分享置顶帖
        //   type: 'indexStickPosts/getPageData',
        //   payload: {
        //     postType: 'share',
        //     url: `${config.SERVER_URL_API_PREFIX}/article/getShareTops`
        //   }
        // }),
        // put({ // 求助置顶帖
        //   type: 'indexStickPosts/getPageData',
        //   payload: {
        //     postType: 'appeal',
        //     url: `${config.SERVER_URL_API_PREFIX}/article/getHelpTops`
        //   }
        // })
      ]))
      yield put({
        type: 'recommendPosts/setState',
        payload: { firstLoading: false }
      })
    },
    *postDetails({ payload }, { all, put }) {
      // lastPostId为上一次加载帖子详情页面时的帖子id
      let { userInfo, id, lastPostId } = payload
      if (lastPostId === id) return

      // 重置redux store中的帖子详情
      yield put({ type: 'postDetails/reset' })
      let [postDetails, _] = yield (yield all([
        put({
          type: 'postDetails/getDetails',
          payload: { id, userInfo }
        }),
        put({
          type: 'postDetails/getComments',
          payload: {
            postId: id,
            page: 1,
            number: 10,
            loginUserId: userInfo && userInfo.userId
          }
        })
      ])) // all类似于Promise.all返回一个Promise对象
      if (postDetails) {
        // 根据返回的帖子详情的userId获取用户详情
        let { userId } = postDetails
        yield put({
          type: 'postDetails/getAuthorInfo',
          payload: {
            authorId: userId,
            userInfo
          }
        })
      }
    },
    *notifyMsgPage({ payload }, { all, call, put }) {
      let { userId } = payload
      yield all([
        put({
          type: 'notify/getNumber',
          payload: { userId }
        }),
        put({
          type: 'privateMsg/getAll'
        })
      ])

    }
  }
}
