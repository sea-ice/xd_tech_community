import React, { useState } from 'react'
import { routerRedux } from 'dva/router'
import { Avatar, Button, Input, message } from 'antd'
import Confirm from 'components/common/Confirm'

import styles from './index.scss'

// const maxLength = (title, maxLength = 10) => title.length > maxLength ? `${title.slice(0, maxLength)}...` : title
const turnToAuthorHomepage = (e, userId, dispatch) => {
  dispatch(routerRedux.push(`/author/${userId}`))
  e.stopPropagation()
}

const maxLength = (title, length = 999) => title.length > length ? `${title.slice(0, length)}...` : title

const makeAvatarWrapper = ({avator, nickName, userId}, dispatch) => (
  <div
    className={styles.avatarWrapper}
    onClick={e => turnToAuthorHomepage(e, userId, dispatch)}
  >
    <Avatar
      style={{ backgroundColor: avator ? '#fff' : '#7265e6', verticalAlign: 'middle' }}
      src={avator} shape="circle" size={36}
    >{!avator && nickName ? nickName[0] : ''}</Avatar>
    <strong>{nickName}</strong>
  </div>
)

const makeCommentMsgReplyBtn = function (
  { nickName, comment1Id },
  { dispatch, loginUserId }
) {
  function ReplyBtn () {
    let [replyContent, updateReplyContent] = useState('')

    const sendReply = function () {
      return new Promise((resolve, reject) => {
        if (!replyContent.trim()) {
          message.error('请输入回复内容！')
          return reject()
        }
        dispatch({
          type: 'comment/publishComment',
          payload: {
            objectId: comment1Id,
            userId: loginUserId,
            content: replyContent,
            reply: true,
            successCallback() {
              message.success('回复成功！')
              resolve(true)
            },
            failCallback() {
              message.success('操作失败，请稍后再试！')
              reject()
            }
          }
        })
      })
    }
    return (
      <div className={styles.btn}>
        <Confirm
          triggerModalBtn={
            <Button type="primary" block>回复</Button>
          }
          modalTitle="回复帖子评论"
          confirmBtnText="发送"
          handleOk={sendReply}
        >
          <p>回复&nbsp;<strong>{nickName}</strong>&nbsp;的评论：</p>
          <Input.TextArea
            placeholder="请输入回复内容"
            value={replyContent}
            onChange={e => updateReplyContent(e.target.value)}></Input.TextArea>
        </Confirm>
      </div>
    )
  }
  return <ReplyBtn />
}

export const msgTemplates = {
  '1': {
    // 评论帖子
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;评论了你的帖子《{maxLength(title)}》：
      </React.Fragment>
    ),
    btnGroup: makeCommentMsgReplyBtn
  },
  '2': { // 评论帖子
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;评论了你的帖子《{maxLength(title)}》：
      </React.Fragment>
    ),
    btnGroup: makeCommentMsgReplyBtn
  },
  '3': {
    // 回复评论
    header: ({ articleTitle, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;回复了你在《{maxLength(articleTitle)}》帖子中的评论：
      </React.Fragment>
    ),
    extraContent: ({ comment1Content }) => {
      return <blockquote
        className={styles.referCommentContent}
        onClick={e => e.stopPropagation()}
      >{comment1Content}</blockquote>
    } // 内容区域默认显示content属性值
  },
  '4': {
    // 帖子点赞
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;赞了你的帖子《{maxLength(title)}》
      </React.Fragment>
    ),
    content: null
  },
  '5': {
    // 帖子点赞
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;赞了你的帖子《{maxLength(title)}》
      </React.Fragment>
    ),
    content: null
  },
  '6': {
    // 评论点赞
    header: ({ articleTitle, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;赞了你在帖子《{maxLength(articleTitle)}》中的评论：
      </React.Fragment>
    ),
    extraContent: ({ comment1Content }) => <blockquote
      className={styles.referCommentContent}
      onClick={e => e.stopPropagation()}
    >{comment1Content}</blockquote>,
    content: null // 不需要显示内容区域
  },
  '7': {
    content: '给你点了个大大的赞'
  },
  '8': {
    // 收藏帖子
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;收藏了你的帖子《{maxLength(title)}》
      </React.Fragment>
    ),
    content: null
  },
  '9': {
    // 收藏帖子
    header: ({ title, ...rest }, { dispatch }) => (
      <React.Fragment>
        {makeAvatarWrapper(rest, dispatch)}
        &nbsp;收藏了你的帖子《{maxLength(title)}》
      </React.Fragment>
    ),
    content: null
  },
  '10': {
    header: ''
  },
  '11': {
    header: ''
  },
  '12': {
    header: ''
  },
  '13': {
    header: '' // 被举报者的处理结果
  },
  '14': {
    header: '你好，你对xxx的举报我们已经收到，感谢你对社区的日益完善所做的努力！', // clickable summary
    ignoreContent: true
  }
}
