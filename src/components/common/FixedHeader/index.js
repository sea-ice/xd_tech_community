import React from 'react'
import {Input, Badge, Icon, Avatar} from 'antd'

import IconBtn from '../IconBtn'
import styles from './index.css'

function FixedHeader () {
  let Search = Input.Search
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>源来，西电人的技术社区</h1>
        <main className={styles.headerMain}>
          <Search
            placeholder="发现更多有趣的"
            onSearch={handleUserSearch}
            enterButton />
          <div className={styles.appLink}>
            <IconBtn iconClassName={styles.flyIcon} iconBtnText="APP" color="#999" fontSize=".28rem" />
          </div>
          <div className={styles.msgNotify}>
            <Badge count={4}>
              <a href="javascript:void(0);" className={styles.msgNotifyIcon}>
                <Icon type="notification" theme="twoTone" style={{fontSize: '.4rem', padding: '.05rem'}} />
              </a>
            </Badge>
          </div>
          <div className={styles.loginUserInfo}>
            {/* <Avatar src='../../../assets/yay.jpg' /> */}
            <a href="javascript:void(0);" className={styles.register}>注册</a>
            <a href="javascript:void(0);" className={styles.login}>登录</a>
          </div>
        </main>
      </div>
    </header>
  )
}

function handleUserSearch () {}

export default FixedHeader
