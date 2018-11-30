export function getSearchObj () {
  let search = window.location.search.slice(1).split('&')
  let searchObj = {}
  for (let kv of search) {
    let [k, v] = kv.split('=')
    searchObj[k] = v
  }
  return searchObj
}
