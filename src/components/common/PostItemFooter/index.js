import React from 'react'
import { Tag } from 'antd'

import styles from './index.css'
import IconBtn from '../IconBtn'
import colorfulTags from 'config/colorfulTags.json'
import { removeDuplicateTags } from 'utils'

function PostItemFooter ({
  publishTime,
  label,
  approvalNum,
  scanNum,
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
        {
          !!label ? (
            <div className={styles.postItemTags}>
              {
                removeDuplicateTags(label).map(
                  tag => <Tag key={tag} color='gold' >{tag}</Tag>
                  // color = { colorfulTags.find(ct => ct.name === tag).color }
                )
              }
            </div>
          ) : null
        }
        {/* <time className={styles.postItemPublishTime}>{publishTime}</time> */}
      </div>
      <div className={styles.postItemStatistic}>
        <IconBtn iconType="eye" iconBtnText={`${scanNum}人看过`} {...commonIconOpt} />
        <IconBtn iconType="heart" iconBtnText={`${approvalNum}人喜欢`} {...commonIconOpt} />
        <IconBtn iconType="message" iconBtnText={`${commentNum}人评论`} {...commonIconOpt} />
      </div>
    </footer>
  )
}

export default PostItemFooter
