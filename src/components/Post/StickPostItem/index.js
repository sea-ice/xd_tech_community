import React, { Component } from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router'

import styles from './index.css'
import PostItemFooter from 'components/common/PostItemFooter'

class StickPostItem extends Component {
  constructor (props) {
    super(props)
    this.showPostDetail = this.showPostDetail.bind(this)
  }
  showPostDetail () {
    let {dispatch} = this.props
    dispatch(routerRedux.push(`/post/1`))
  }
  render () {
    let {
      title,
      ...postFooterInfo
    } = this.props
    return (
      <li className={styles.postItem} onClick={this.showPostDetail}>
        <i className={styles.stickIcon}></i>
        <h2 className={styles.stickPostTitle}>[置顶]{title}</h2>
        <PostItemFooter {...postFooterInfo} />
      </li>
    )
  }
}

export default connect()(StickPostItem)
