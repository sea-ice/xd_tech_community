import {fillPostListPayload} from 'utils'

export default {
  namespace: 'firstScreenRender',
  state: {},
  reducers: {},
  effects: {
    *indexPage({payload}, {put}) {
      let {userInfo} = payload
      yield [
        put({ // 推荐分享帖
          type: 'recommendPosts/getPageData',
          payload: fillPostListPayload(
            userInfo, 'share', 0, userInfo && userInfo.label.split(','))
        }),
        put({ // 推荐求助帖
          type: 'recommendPosts/getPageData',
          payload: fillPostListPayload(
            userInfo, 'help', 0, userInfo && userInfo.label.split(','))
        }),
        put({ // 分享置顶帖
          type: 'indexStickPosts/getPageData',
          payload: {
            postType: 'share',
            url: '/api/article/getShareTops'
          }
        }),
        // put({ // 求助置顶帖
        //   type: 'indexStickPosts/getPageData',
        //   payload: {
        //     postType: 'help',
        //     url: '/api/article/getHelpTops'
        //   }
        // })
      ]
    }
  }
}
