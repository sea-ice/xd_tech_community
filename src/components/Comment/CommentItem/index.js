import React, { Component } from 'react'

import styles from './index.scss'
import ReplyItem from '../ReplyItem'

class CommentItem extends Component {
  // flatComments (flatResult, c) {
  //   for (let i = 0, len = c.length; i < len; i++) {
  //     if (c[i].replies) {
  //       flatResult.splice(flatResult.length, 0, ...c[i].replies)
  //       return this.flatComments(flatResult, c[i].replies)
  //     }
  //   }
  // }
  state = {
    collapseReplies: true
  };
  constructor (props) {
    super(props)
    this.toggleReplies = this.toggleReplies.bind(this)
  }
  toggleReplies () {
    this.setState({collapseReplies: !this.state.collapseReplies})
  }
  render () {
    let {comment, number} = this.props,
        replies = []
    // this.flatComments(replies, [comment])
    // let replyItems = sortCommentItems(replies).map(
    //   r => <ReplyItem key={r._id} comment={r} />
    // )
    let {collapseReplies} = this.state
    return (
      <div className={styles.commentItem}>
        <ReplyItem rootComment={number} replyDetails={{
          publisher: {
            username: 'PropTypes.string',
            avatar: '',
          },
          content: 'PropTypes.string',
          publishTime: 'PropTypes.string',
          agree: 22,
          agreed: true
        }}
        toggleReplies={this.toggleReplies}
        collapseReplies={collapseReplies} />
        <div className={collapseReplies ? styles.replyCollapse : styles.replySpread}>
          <ReplyItem replyDetails={{
            publisher: {
              username: 'PropTypes.string',
              avatar: '',
            },
            content: 'PropTypes.string',
            publishTime: 'PropTypes.string',
            agree: 22,
            agreed: true
          }} />
          <ReplyItem replyDetails={{
            publisher: {
              username: 'PropTypes.string',
              avatar: '',
            },
            content: 'PropTypes.string',
            publishTime: 'PropTypes.string',
            agree: 22,
            agreed: true
          }} />
        </div>
        {/* {replyItems} */}
      </div>
    )
  }
}

export default CommentItem
