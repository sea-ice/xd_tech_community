import React from 'react'
import {Icon, Avatar} from 'antd'

import styles from './index.css'

function IconBtn ({
  type = 'custom',
  avatarSize,
  avatarURL,
  color = "#1890ff",
  iconSize,
  iconType,
  iconClassName,
  iconBtnText,
  btnPadding = '.3rem',
  fontSize = ".24rem",
  lineHeight,
  onIconClick
}) {
  return (
    <a
      href="javascript:void(0);"
      className={styles.iconBtn}
      style={{padding: `0 ${btnPadding}`}}
      onClick={onIconClick}
    >
      {
        type === 'avatar' ? <Avatar src={avatarURL} size={avatarSize} /> : type === 'icon' ?  <Icon type={iconType} style={{fontSize: iconSize, color}} /> : <i className={iconClassName}></i>}
      <span
        className={styles.iconBtnText}
        style={{color, fontSize, lineHeight}}>{iconBtnText}</span>
    </a>
  )
}

export default IconBtn
