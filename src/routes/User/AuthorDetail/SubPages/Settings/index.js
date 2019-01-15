import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Tag } from 'antd'

import styles from './index.scss'
import secret from 'config/secret.config'

@connect(state => ({
  loginUserId: state.user.userId,
  authorId: state.author.validAuthorId,
  authorInfo: state.author.authorInfo
}))
class Settings extends Component {
  constructor(props) {
    super(props)
    this.setTags = this.setTags.bind(this)
    this.setNewPassword = this.setNewPassword.bind(this)
  }

  componentDidMount() {
    let { dispatch, authorId } = this.props
    // 获取用户等级
    dispatch({
      type: 'author/getAuthorLevel',
      payload: {
        authorId
      }
    })
  }
  setTags() {
    let { loginUserId } = this.props
    this.turnToPage(`/author/${loginUserId}?tab=tag-manage`)
  }
  setNewPassword() {
    let { loginUserId } = this.props
    this.turnToPage(`/author/${loginUserId}?tab=modify-password`)
  }
  turnToPage(path) {
    let { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }
  render() {
    let { loginUserId, authorId, authorInfo } = this.props
    let { label } = authorInfo
    return (
      <div className={styles.settings}>
        <section className={styles.section}>
          <div className={styles.titleWrapper}>
            <h3>用户设置</h3>
          </div>
          <ul>
            <li>
              <label>感兴趣标签</label>
              <div className={styles.settingField}>
                {
                  !!label ? (
                    <div className={styles.tags}>
                      {
                        label.split(',').map(
                          tag => <Tag color="magenta" key={tag}>{tag}</Tag>
                        )
                      }
                    </div>
                  ) : <span>暂无标签</span>
                }
                <a href="javascript:void(0);" className={styles.settingBtn} onClick={this.setTags}>设置</a>
              </div>
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <div className={styles.titleWrapper}>
            <h3>账户安全</h3>
          </div>
          <ul>
            <li>
              <label>登录密码</label>
              <div className={styles.settingField}>
                <p>******</p>
                <a href="javascript:void(0);" className={styles.settingBtn} onClick={this.setNewPassword}>修改</a>
              </div>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}

Settings.propTypes = {
  guest: PropTypes.bool
};

export default Settings;
