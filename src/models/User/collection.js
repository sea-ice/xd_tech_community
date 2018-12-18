import {
  postJSON
} from "utils"
import config from 'config/constants'

export default {
  namespace: 'collection',
  state: {
    all: [],
    temp: [], // 临时新建的收藏夹
    selectedTargetWhenSavePost: 0 // 用于帖子详情选择收藏夹时指示当前选中的收藏夹
  },
  reducers: {
    setState(state, { payload }) {
      return Object.assign({}, state, payload)
    },
    addItem(state, { payload }) {
      let { key, item } = payload
      let items = state[key].slice()
      items.push(item)
      return Object.assign({}, state, {
        [key]: items
      })
    },
    setItem(state, { payload }) {
      let { key, items } = payload
      let itemIdxes = Object.keys(items)
      let newItems = state[key].slice()
      for (let i of itemIdxes) {
        newItems[i] = Object.assign({}, newItems[i], items[i])
      }
      return Object.assign({}, state, {
        [key]: newItems
      })
    }
  },
  effects: {
    *new({ payload }, { all, call, put }) {
      let { userId, collectionName, successCallback, failCallback} = payload
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/favorite/newFavoritrDir`, {
          userId,
          favoriteDir: collectionName
        }))
      let { data: { code } } = res
      console.log('new')
      console.log(res)
      if (code === 100) {
        yield (yield all([
          put({
            type: 'addItem',
            payload: {
              key: 'all',
              item: {
                favoriteDir: collectionName,
                articleNum: 0
              }
            }
          }),
          put({
            type: 'setState', // 清除temp
            payload: { temp: [] }
          })
        ]))
        successCallback()
      } else {
        failCallback()
      }
    },
    *getAll({ payload }, { call, put }) {
      let { userId } = payload

      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/favorite/getFavoriteDir`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        // console.log(body)
        yield put({
          type: 'setState',
          payload: {all: body}
        })
        if (!body.length) {
          // 如果没有收藏夹，则将帖子详情选中的idx置为null
          yield put({
            type: 'setState',
            payload: { selectedTargetWhenSavePost: null }
          })
        }
      }
    }
  }
}
