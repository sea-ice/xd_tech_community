import React, { Component } from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router'
import dayjs from 'dayjs'

import styles from './index.scss'
import config from 'config/constants'
import IconBtn from 'components/common/IconBtn'
import PostItemFooter from 'components/common/PostItemFooter'

class PlainPostItem extends Component {
  constructor (props) {
    super(props)
    this.showPostDetail = this.showPostDetail.bind(this)
  }
  showPostDetail () {
    let {dispatch, articleId} = this.props
    dispatch(routerRedux.push(`/post/${articleId}`))
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
    return (
      <li className={styles.postItem} onClick={this.showPostDetail}>
        <header className={styles.postItemHeader}>
          <div className={styles.avatarWrapper}>
            <IconBtn type="avatar" avatarURL={avator} iconBtnText={nickName} btnPadding='0' color="#333" />
            <time className={styles.postItemPublishTime}>{
              dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')
            }</time>
          </div>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <main className={styles.postItemMain}>
          {image !== '-1' ? <img className={styles.poster} src={image} alt="poster" /> : null}
          <p className={styles.content}>{content}</p>
        </main>
        <PostItemFooter {...postFooterInfo} />
      </li>
    )
  }
}

export default connect()(PlainPostItem)
