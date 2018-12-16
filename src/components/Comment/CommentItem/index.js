import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createSelector } from 'reselect'
import { connect } from 'dva'
import { Pagination } from 'antd'

import styles from './index.scss'
import ReplyItem from '../ReplyItem'

const commentSelector = createSelector(
  (state, props) => state.postDetails.comments.find(
    item => item.commentsv1Id === props.commentId),
  comment => comment
)

@connect((state, ownProps) => ({
  replyInfo: commentSelector(state, ownProps)
}))
class CommentItem extends Component {
  constructor (props) {
    super(props)
    this.toggleReplies = this.toggleReplies.bind(this)
    this.onReplyPageChange = this.onReplyPageChange.bind(this)
  }
  toggleReplies() {
    let { dispatch, commentId, replyInfo } = this.props
    let { open } = replyInfo

    if (!open) {
      dispatch({
        type: 'comment/getReplies',
        payload: {
          commentId,
          page: 1,
          number: 5
        }
      })
    }
    dispatch({
      type: 'postDetails/setItem',
      payload: {
        key: 'comments',
        itemFilter: item => item.commentsv1Id === commentId,
        newItem: { open: !open }
      }
    })
  }
  onReplyPageChange(page) {
    let { dispatch, replyInfo } = this.props
    let { replies, commentsv1Id, replyCurrentPage } = replyInfo

    if (replyCurrentPage === page) return

    dispatch({
      type: 'comment/getReplies',
      payload: {
        commentId: commentsv1Id,
        page,
        number: 5,
        loadedNumber: replies.length
      }
    })
  }
  render () {
    let { loginUserId, replyInfo, number } = this.props
    let { replies, commentNum, replyCurrentPage, open } = replyInfo
    if (replies) {
      let replyPageStart = (replyCurrentPage - 1) * 5
      replies = replies.slice(replyPageStart, replyPageStart + 5)
    }

    return (
      <div className={styles.commentItem}>
        <ReplyItem
          rootComment={number}
          loginUserId={loginUserId}
          replyInfo={replyInfo}
          toggleReplies={this.toggleReplies}
          open={open} />
        <div className={open ? styles.replySpread : styles.replyCollapse}>
          {
            !!replies ? (commentNum > 5 ? (
              <React.Fragment>
                {
                  replies.map((item, i) => (
                    <ReplyItem
                      key={i}
                      loginUserId={loginUserId}
                      replyInfo={item} />
                  ))
                }
                <div className={styles.paginatorWrapper}>
                  <Pagination
                    defaultCurrent={1}
                    size="small"
                    total={commentNum}
                    pageSize={5}
                    onChange={this.onReplyPageChange} />
                </div>
              </React.Fragment>
            ) : (
              replies.map((item, i) => (
                <ReplyItem
                  key={i}
                  loginUserId={loginUserId}
                  replyInfo={item} />
              ))
            )) : null
          }
        </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
  number: PropTypes.number,
  loginUserId: PropTypes.number,
  replyInfo: PropTypes.object
}

export default CommentItem
