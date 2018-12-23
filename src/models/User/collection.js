import {
  postJSON
} from "utils"
import config from 'config/constants'

export default {
  namespace: 'collection',
  state: {
    loadingAll: false,
    all: [],
    temp: [], // 临时新建的收藏夹
    selectedTargetWhenSavePost: null // 用于帖子详情选择收藏夹时指示当前选中的收藏夹
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
    updateItem(state, { payload }) {
      let { key, itemFilterField, items } = payload
      let newItems = state[key].slice()
      let itemKeys = Object.keys(items)
      if (!itemFilterField) {
        for (let i of itemKeys) {
          newItems[i] = Object.assign({}, newItems[i], items[i])
        }
      } else {
        for (let val of itemKeys) {
          let i = newItems.findIndex(item => item[itemFilterField] === val)
          newItems[i] = Object.assign({}, newItems[i], items[val])
        }
      }
      return Object.assign({}, state, {
        [key]: newItems
      })
    },
    updateStateAndItems(state, { payload }) {
      let { itemFilterField, newState } = payload
      let ns = {}

      for (let key in newState) {
        let isArray = Object.prototype.toString.call(state[key]) === '[object Array]'
        // if (!isArray) throw new Error(`state[${key}] is not an array`)
        if (!isArray) {
          ns[key] = newState[key]
          continue
        }

        let newArray = []
        for (let newItem of newState[key]) { // state需要更新的key对应的数组长度以给定的newState为准
          let originItem = state[key].find(item => item[itemFilterField] === newItem[itemFilterField])
          newArray.push(Object.assign({}, originItem, newItem))
        }
        ns[key] = newArray
      }
      return Object.assign({}, state, ns)
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
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    },
    *getAll({ payload }, { call, put }) {
      let { userId, noLoading, successCallback } = payload
      if (!noLoading) {
        yield put({
          type: 'setState',
          payload: { loadingAll: true }
        })
      }
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/favorite/getFavoriteDir`, {
          userId
        }))
      let { data: { code, body } } = res
      if (code === 100) {
        // console.log(body)
        if (successCallback) {
          successCallback(body)
        }
        yield put({
          type: 'updateStateAndItems',
          payload: {
            itemFilterField: 'favoriteDir',
            newState: {
              all: body,
              loadingAll: false
            }
          }
        })
      }
    },
    *getCollectionPosts({ payload }, { call, put }) {
      let { userId, favoriteDir, page, number } = payload

      yield put({
        type: 'updateItem',
        payload: {
          key: 'all',
          itemFilterField: 'favoriteDir',
          items: {
            [favoriteDir]: { loading: true, open: true }
          }
        }
      })
      console.log(userId)
      let res = yield call(() => postJSON(
        `${config.SERVER_URL_API_PREFIX}/favorite/getFavoriteDir`, {
          userId
        }))
      let { data: { code, body } } = res
      let newItem = { loading: false }
      if (code === 100) {
        let collection = body.find(item => item.favoriteDir === favoriteDir)
        if (collection) {
          let { articleNum } = collection
          if (articleNum) {
            let currentPage = Math.min(page, Math.ceil(articleNum / number))
            let res = yield call(() => postJSON(
              `${config.SERVER_URL_API_PREFIX}/favorite/getMyFavorite/Update`, {
                userId,
                favoriteDir,
                page: currentPage,
                lastId: 0,
                number: currentPage * number
              }))
            let { data: { code, body } } = res
            console.log(body)
            if (code === 100) {
              let pageStart = (currentPage - 1) * number
              let posts = body.slice(pageStart, pageStart + number)
              newItem = { ...newItem, currentPage, articleNum, posts }
            } else {
              newItem = { ...newItem, error: true }
            }
          } else {
            newItem = { ...newItem, posts: [], currentPage: 0, articleNum: 0 }
          }
        } else {
          // 收藏夹不存在
          newItem = { ...newItem, error: true, message: '该收藏夹不存在~' }
        }
      } else {
        newItem = { ...newItem, error: true }
      }
      yield put({
        type: 'updateItem',
        payload: {
          key: 'all',
          itemFilterField: 'favoriteDir',
          items: {
            [favoriteDir]: newItem
          }
        }
      })
    },
    *closeCollectionItem({ payload }, { put }) {
      let { favoriteDir } = payload
      yield put({
        type: 'updateItem',
        payload: {
          key: 'all',
          itemFilterField: 'favoriteDir',
          items: {
            [favoriteDir]: { open: false }
          }
        }
      })
    },
    *clearCollection({ payload }, { call, put }) {
      let { authorId, favoriteDir, toDelete, successCallback, failCallback } = payload
      let res = yield call(() => postJSON(
        `${
          config.SERVER_URL_API_PREFIX
        }/favorite/${
          toDelete ? 'delete' : 'empty'
        }FavoriteDir`, {
          userId: authorId,
          favoriteDir
        }))
      console.log(res)
      let { data: { code, body } } = res
      if (code === 100) {
        if (successCallback) successCallback()
      } else {
        if (failCallback) failCallback()
      }
    }
  }
}
