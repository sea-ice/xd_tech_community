export function hasStorageKey (
  key,
  storage=window.localStorage
) {
  for (let i = 0, len = storage.length; i < len; i++) {
    if (storage.key(i) === key) return true
  }
  return false
}
