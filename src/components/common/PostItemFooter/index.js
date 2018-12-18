import React from 'react'
import {Tag} from 'antd'

import styles from './index.css'
import IconBtn from '../IconBtn'
import colorfulTags from 'config/colorfulTags.json'

function PostItemFooter ({
  publishTime,
  label,
  approvalNum,
  view,
  commentNum
}) {
  let commonIconOpt = {
    type: 'icon',
    iconSize: '24px',
    // fontSize: '16px',
    btnPadding: '.2rem',
    color: '#666'
  }
  return (
    <footer className={styles.postItemFooter}>
      <div className={styles.postItemInfo}>
        <div className={styles.postItemTags}>
          {
            label && label.split(',').map(
            tag => <Tag
              key={tag}
              // color={colorfulTags.find(ct => ct.name === tag).color}
              color='gold'
            >{tag}</Tag>)
          }
          {/* <Tag color="magenta">JavaScript</Tag>
          <Tag color="red">CSS</Tag>
          <Tag color="volcano">HTML</Tag> */}
          {/* <Tag color="orange">orange</Tag>
          <Tag color="gold">gold</Tag>
          <Tag color="lime">lime</Tag>
          <Tag color="green">green</Tag>
          <Tag color="cyan">cyan</Tag>
          <Tag color="blue">blue</Tag>
          <Tag color="geekblue">geekblue</Tag>
          <Tag color="purple">purple</Tag> */}
        </div>
        {/* <time className={styles.postItemPublishTime}>{publishTime}</time> */}
      </div>
      <div className={styles.postItemStatistic}>
        <IconBtn iconType="eye" iconBtnText={`${view}人看过`} {...commonIconOpt} />
        <IconBtn iconType="heart" iconBtnText={`${approvalNum}人喜欢`} {...commonIconOpt} />
        <IconBtn iconType="message" iconBtnText={`${commentNum}人评论`} {...commonIconOpt} />
      </div>
    </footer>
  )
}

export default PostItemFooter
