// 我关注的人
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Popover, Avatar } from 'antd';

import styles from './index.scss'
import config from 'config/constants'
import ReportBtn from 'components/User/ReportBtn'
import UserFollowState from 'components/User/UserFollowState'

@connect(state => ({
  loginUserId: state.user.userId,
}))
class FollowUserItem extends Component {
  state = {
    relationship: config.author.NO_RELATIONSHIP
  }
  constructor(props) {
    super(props)
    this.turnToAuthorHomepage = this.turnToAuthorHomepage.bind(this)
    this.updateFollowAuthorState = this.updateFollowAuthorState.bind(this)
  }

  componentDidMount() {
    let { dispatch, loginUserId, userId } = this.props
    if (loginUserId) { // 如果当前用户登录，则获取当前登录用户与列表中的用户的关系
      dispatch({
        type: 'author/getAuthorFollowState',
        payload: {
          userId: loginUserId,
          authorId: userId,
          successCallback: body => {
            let { status } = body
            this.setState({ relationship: status })
          }
        }
      })
    }
  }
  turnToAuthorHomepage() {
    let { dispatch, userId } = this.props
    dispatch(routerRedux.push(`/author/${userId}`))
  }
  updateFollowAuthorState(followState) {
    this.setState({ relationship: followState })
  }
  render() {
    let { loginUserId, userId, nickName, avator, introduction } = this.props
    let { relationship } = this.state
    return (
      <div className={styles.followItem}>
        <div className={styles.avatarWrapper} onClick={this.turnToAuthorHomepage}>
          <Avatar src={avator} shape="square" />
        </div>
        <div className={styles.header}>
          <div className={styles.nickNameWrapper}>
            <h4 onClick={this.turnToAuthorHomepage}>{nickName}</h4>
            {
              (!loginUserId || userId && (loginUserId !== userId)) ? (
                <div className={styles.btn}>
                  <UserFollowState
                    authorId={userId}
                    followState={relationship}
                    customBtnProps={{ size: 'small', block: true }}
                    updateSuccessCallback={this.updateFollowAuthorState}
                  />
                </div>
              ) : null
            }
          </div>

          <Popover content={
            <ul className={styles.popoverBtns}>
              <li>
                <ReportBtn objectType={1} objectId={userId} />
              </li>
            </ul>
          } placement="bottomRight">
            <i
              className={styles.more}
              style={{ backgroundImage: `url(${config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)` }}></i>
          </Popover>
        </div>
        <main className={styles.main}>
          <p className="signature">{introduction || <i>暂无个人介绍</i>}</p>
        </main>
      </div>
    );
  }
}

FollowUserItem.propTypes = {
  guest: PropTypes.bool
};

export default FollowUserItem;
