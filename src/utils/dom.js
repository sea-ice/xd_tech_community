export function initRootFontSize() {
  let htmlEle = document.documentElement
  let rootFontSize = htmlEle.clientWidth * 50 / 1000
  htmlEle.style.fontSize = `${rootFontSize}px`
}

export function getRootFontSize() {
  return document.documentElement.clientWidth * 50 / 1000
}
