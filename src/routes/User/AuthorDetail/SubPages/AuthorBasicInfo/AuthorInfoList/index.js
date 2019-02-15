import React, { Component } from 'react'
import { Tag, Popover } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import styles from './index.scss'
import config from 'config/constants'
import ReportBtn from 'components/User/ReportBtn'

@connect(state => ({
  authorId: state.author.validAuthorId,
  loginUserId: state.user.userId,
}))
class AuthorInfoList extends Component {
  constructor(props) {
    super(props)
    this.turnToSetTagsPage = this.turnToSetTagsPage.bind(this)
  }
  turnToSetTagsPage() {
    let { dispatch, loginUserId } = this.props
    dispatch(routerRedux.push(`/author/${loginUserId}?tab=tag-manage`))
  }
  render() {
    let { loginUserId, authorId, nickName, gender, school, education, location, label, introduction } = this.props
    return (
      <ul className={styles.infoList}>
        <li>
          <label>昵称</label>
          <div className={styles.nickNameWrapper}>
            <p className="nickName">{nickName}</p>
            <Popover content={
              <ul className={styles.popoverBtns}>
                <li>
                  <ReportBtn
                    objectType={2}
                    objectId={115} />
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
          </div>
        </li>
        <li>
          <label>感兴趣标签</label>
          <div className={styles.fieldContent}>
            {
              !!label ? label.split(',').map(
                tag => <Tag color="magenta" key={tag}>{tag}</Tag>
              ) : (
                <React.Fragment>
                  <span>暂无标签</span>
                  {loginUserId === authorId ? (
                    <a href="javascript:void(0);" className={styles.setTagsBtn} onClick={this.turnToSetTagsPage}>去设置</a>
                  ) : null}
                </React.Fragment>
              )
            }
          </div>
        </li>
        <li>
          <label>性别</label>
          <p>{gender === 1 ? '男' : '女'}</p>
        </li>
        <li>
          <label>学校</label>
          <p>{school}</p>
        </li>
        <li>
          <label>学历</label>
          <p>{education}</p>
        </li>
        <li>
          <label>地区</label>
          <p>{location}</p>
        </li>
        <li>
          <label>个人介绍</label>
          <p>{introduction || <i>暂未填写</i>}</p>
        </li>
      </ul>
    )
  }
}

export default AuthorInfoList;