import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Popover } from 'antd'
import dayjs from 'dayjs'

import { setHTMLSafely } from 'utils'

import styles from './index.scss'
import config from 'config/constants'
import ReportBtn from 'components/User/ReportBtn'
import IconBtn from 'components/common/IconBtn'

@connect(state => ({
  comments: state.postDetails.comments
}))
class ReplyItem extends Component {
  constructor (props) {
    super(props)
    // this.updateReplyLikeState = this.updateReplyLikeState.bind(this)
    this.turnToAuthorHomepage = this.turnToAuthorHomepage.bind(this)
  }
  // updateReplyLikeState() {
  //   let { dispatch, replyInfo, comments } = this.props
  //   let { commentsv1Id, commentsv2Id } = replyInfo
  //   dispatch({
  //     type: 'comment/updateReplyLikeState',
  //     payload: {
  //       commentsv1Id,
  //       commentsv2Id,
  //       comments
  //     }
  //   })
  // }
  turnToAuthorHomepage() {
    let { dispatch, replyInfo } = this.props
    let { userId } = replyInfo
    dispatch(routerRedux.push(`/author/${userId}`))
  }
  render () {
    let {
      loginUserId,
      replyInfo
    } = this.props
    // 如果是一级评论，则replyInfo只具有commentsv1Id，如果是评论的评论，
    // 则同时具有commentsv1Id和commentsv2Id
    let { userId, nickName, avator, commentsv1Id, commentsv2Id,
      content, isApproval, approvalNum, time } = replyInfo
    console.log(this.props.comments)

    // let commonIconOpt = {
    //   type: 'icon',
    //   color: '#666',
    //   btnPadding: '.2rem',
    //   iconSize: 20,
    //   fontSize: 16
    // }
    return (
      <section className={styles.replyItem}>
        <main className={styles.replyMain}>
          <header className={styles.replyItemHeader}>
            <p className={styles.publisherInfo}>
              <IconBtn
                type="avatar"
                avatarSize={36}
                avatarURL={avator}
                color="#333"
                iconBtnText={nickName}
                btnPadding={0}
                onClick={this.turnToAuthorHomepage}
              />
              <time>{dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')}</time>
            </p>
            {
              loginUserId === userId ? null : (
                <Popover content={
                  <ul className={styles.popoverBtns}>
                    <li>
                      <ReportBtn
                        objectType={3}
                        objectId={commentsv2Id} />
                    </li>
                  </ul>
                } placement="bottomRight">
                  <i
                    className={styles.more}
                    style={{
                      backgroundImage: `url(${
                        config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)`
                    }}></i>
                </Popover>
              )
            }
          </header>
          <p className={styles.commentContent} dangerouslySetInnerHTML={{ __html: setHTMLSafely(content, true)}}></p>
          {/* <footer className={styles.replyItemFooter}>
            <div className={styles.iconBtns}>
              <Debounce
                btnProps={getIconBtnToggleProps(approvalNum, isApproval, '赞同', '#1890ff')}
                actionType="userBehaviors/approval"
                extraPayload={{ type: 3, objectId: commentsv2Id, like: !isApproval }}
                userId={loginUserId}
                update={this.updateReplyLikeState}
                btn={
                  <IconBtn iconType="like" {...commonIconOpt} />
                }
              />
            </div>
            <Popover content={
              <ul className={styles.popoverBtns}>
                <li>
                  <ReportBtn
                    objectType={3}
                    objectId={commentsv2Id} />
                </li>
              </ul>
            } placement="bottomRight">
              <i
                className={styles.more}
                style={{
                  backgroundImage: `url(${
                    config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)`
                }}></i>
            </Popover>
          </footer> */}
        </main>
      </section>
    )
  }
}

ReplyItem.propTypes = {
  loginUserId: PropTypes.number,
  rootComment: PropTypes.number, // 顶层评论使用，代表评论楼层
  toggleReplies: PropTypes.func, // 顶层评论使用
  collapseReplies: PropTypes.bool, // 顶层评论使用
  replyInfo: PropTypes.object
}

export default ReplyItem
