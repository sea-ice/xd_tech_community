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
  iconColor,
  iconTheme,
  iconClassName,
  bgImage,
  iconBtnText,
  btnPadding = '.3rem',
  fontSize = "16px",
  iconBtnStyle = {},
  lineHeight,
  onClick,
  onFocus,
  onMouseEnter,
  onMouseLeave
}) {
  return (
    <a
      href="javascript:void(0);"
      className={styles.iconBtn}
      style={{padding: `0 ${btnPadding}`, ...iconBtnStyle}}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {
        type === 'avatar' ?
          <Avatar src={avatarURL} size={avatarSize} /> :
          type === 'icon' ?
            <Icon
              type={iconType}
              style={{ fontSize: iconSize, color: (iconColor || color) }}
              theme={iconTheme} /> :
            <i className={iconClassName} style={{backgroundImage: `url(${bgImage})`}}></i>
      }
      <span
        className={styles.iconBtnText}
        style={{color, fontSize, lineHeight}}>{iconBtnText}</span>
    </a>
  )
}

export default IconBtn
