import React, { Component } from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router'

import styles from './index.scss'
import IconBtn from 'components/common/IconBtn'
import PostItemFooter from 'components/common/PostItemFooter'
import { getPostExcerpt, timeRelativeToNow } from 'utils'

class PlainPostItem extends Component {
  constructor (props) {
    super(props)
    this.showPostDetail = this.showPostDetail.bind(this)
    this.showAuthorHomepage = this.showAuthorHomepage.bind(this)
  }
  remeberCurrentPosition() {
    let { remeberCurrentPageScrollState } = this.props
    if (remeberCurrentPageScrollState) remeberCurrentPageScrollState()
  }
  showPostDetail () {
    let { dispatch, articleId } = this.props
    this.remeberCurrentPosition()
    dispatch(routerRedux.push(`/post/${articleId}`))
  }
  showAuthorHomepage(e) {
    let { dispatch, userId } = this.props
    this.remeberCurrentPosition()
    dispatch(routerRedux.push(`/author/${userId}`))
    e.stopPropagation()
  }
  render () {
    let {
      avator,
      nickName,
      title,
      image,
      content,
      time,
      ...postFooterInfo
    } = this.props
    let excerpt = getPostExcerpt(content)

    return (
      <li className={styles.postItem} onClick={this.showPostDetail}>
        <header className={styles.postItemHeader}>
          <div className={styles.avatarWrapper}>
            <IconBtn
              type="avatar"
              avatarURL={avator}
              iconBtnText={nickName}
              onClick={this.showAuthorHomepage}
              btnPadding='0' color="#333" />
            <time className={styles.postItemPublishTime}>{
              timeRelativeToNow(time)
            }</time>
          </div>
          <h2 className={styles.title}>{title}</h2>
        </header>
        {!!excerpt ? (
          <main className={styles.postItemMain}>
            {image !== '-1' ? <img className={styles.poster} src={image} alt="poster" /> : null}
            <p className={styles.content}>{excerpt}</p>
          </main>
        ) : <div className={styles.placeholder}></div>}
        <PostItemFooter {...postFooterInfo} />
      </li>
    )
  }
}

export default connect()(PlainPostItem)
