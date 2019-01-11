import categories from 'config/categoryTags.json'

export default {
  namespace: 'postFilterState',
  state: {
    collapse: true,
    activeCategory: categories[0].name,
    selectedTags: [],
    confirmState: 'confirmed', // waitConfirm -> loading -> confirmed
    confirmedTags: []
  },
  reducers: {
    setState (state, {payload}) {
      return Object.assign({}, state, payload)
    },
    initPostFilter (state, {payload}) {
      let {userInfo} = payload
      let selectedTags = !!(userInfo && userInfo.label) ? userInfo.label.split(',') : []

      return Object.assign({}, state, {
        collapse: !!userInfo,
        selectedTags,
        confirmedTags: selectedTags.slice(),
        confirmState: 'confirmed'
      })
    },
    changeOneTag (state, {payload}) {
      let {selectedTags} = payload
      return Object.assign({}, state, {
        confirmState: 'waitConfirm',
        selectedTags
      })
    }
  },
  effects: {}
}
