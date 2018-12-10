import React, { Component } from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router'

import styles from './index.css'
import IconBtn from 'components/common/IconBtn'
import PostItemFooter from 'components/common/PostItemFooter'

class PlainPostItem extends Component {
  constructor (props) {
    super(props)
    this.showPostDetail = this.showPostDetail.bind(this)
  }
  showPostDetail () {
    let {dispatch} = this.props
    dispatch(routerRedux.push('/post/1'))
  }
  render () {
    let {
      avatarURL,
      username,
      title,
      posterURL,
      content,
      ...postFooterInfo
    } = this.props
    return (
      <li className={styles.postItem} onClick={this.showPostDetail}>
        <header className={styles.postItemHeader}>
          <div className={styles.avatarWrapper}>
            <IconBtn type="avatar" avatarURL={avatarURL} iconBtnText={username} btnPadding='0' color="#333" />
          </div>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <main className={styles.postItemMain}>
          {posterURL ? <img className={styles.poster} src={posterURL} alt="poster" /> : null}
          <p className={posterURL ? styles.contentWithPoster : styles.content}>{content}</p>
        </main>
        <PostItemFooter {...postFooterInfo} />
      </li>
    )
  }
}

export default connect()(PlainPostItem)
