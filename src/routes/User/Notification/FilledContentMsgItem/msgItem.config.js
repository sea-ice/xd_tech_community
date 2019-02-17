import React from 'react'
import styles from './index.scss'

// const maxLength = (title, maxLength = 10) => title.length > maxLength ? `${title.slice(0, maxLength)}...` : title

export const msgTemplates = {
  '1': {
    // user1_id:

    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;评论了你的帖子《{title}》：
      </React.Fragment>
    ),
  },
  '2': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;评论了你的帖子《{title}》：
      </React.Fragment>
    ),
  },
  '3': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;回复了你在《{title}》帖子中的评论：
      </React.Fragment>
    ),
    extraContent: () => {
      return <p
        className={styles.replyToContent}
        onClick={e => e.stopPropagation()}
      >“评论了啥”</p>
    } // 内容区域默认显示content属性值
  },
  '4': {
    // user1_id:
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;赞了你的帖子《{title}》
      </React.Fragment>
    ),
    content: null
  },
  '5': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;赞了你的帖子《{title}》
      </React.Fragment>
    ),
    content: null
  },
  '6': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;赞了你在帖子《{title}》中的评论：
      </React.Fragment>
    ),
    extraContent: ({ title }) => <p
      className={styles.replyToContent}
      onClick={e => e.stopPropagation()}
    >“评论了啥”</p>,
    content: null // 不需要显示内容区域
  },
  '7': {
    content: '给你点了个大大的赞'
  },
  '8': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;收藏了你的帖子《{title}》
      </React.Fragment>
    ),
    content: null
  },
  '9': {
    header: ({ nickName, title }) => (
      <React.Fragment>
        <strong>{nickName}</strong>
        &nbsp;收藏了你的帖子《{title}》
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
