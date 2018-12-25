import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Popover, message } from 'antd'

import config from 'config/constants'
import styles from './index.scss'
import Debounce from 'components/common/Debounce'
import IconBtn from 'components/common/IconBtn'

@connect(state => ({
  userId: state.user.userId
}))
class UserFollowState extends Component {
  constructor(props) {
    super(props)
    this.unfollowAuthor = this.unfollowAuthor.bind(this)
    this.updateAuthorFollowState = this.updateAuthorFollowState.bind(this)
  }
  getBtnProps(state) {
    let {
      HAS_BEEN_FOLLOWED,
      NO_RELATIONSHIP,
      HAS_FOLLOWED,
      MUTUAL_FOLLOW } = config.author
    switch (state) {
      case HAS_BEEN_FOLLOWED:
        return { iconType: 'plus', iconBtnText: '关注' }
      case NO_RELATIONSHIP:
        return { iconType: 'plus', iconBtnText: '关注' }
      case HAS_FOLLOWED:
        return { iconType: 'user', iconBtnText: '已关注' }
      case MUTUAL_FOLLOW:
        return { iconType: 'swap', iconBtnText: '互相关注' }
      default: break
    }
  }
  updateAuthorFollowState(unfollow) {
    let { dispatch, followState } = this.props
    let {
      HAS_BEEN_FOLLOWED,
      NO_RELATIONSHIP,
      HAS_FOLLOWED,
      MUTUAL_FOLLOW } = config.author
    let newFollowState
    if (unfollow) { // 当前是取消关注
      newFollowState = followState === MUTUAL_FOLLOW ? HAS_BEEN_FOLLOWED : NO_RELATIONSHIP
    } else {
      newFollowState = followState === HAS_BEEN_FOLLOWED ? MUTUAL_FOLLOW : HAS_FOLLOWED
    }
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'authorInfo',
        newInfo: {
          relationship: newFollowState
        }
      }
    })
  }
  unfollowAuthor() {
    let { dispatch, userId, authorId } = this.props
    if (!userId) {
      // TODO: 未登录需要先跳转到登录页面
      return
    }
    dispatch({
      type: 'userBehaviors/followAuthor',
      payload: {
        userId,
        authorId,
        follow: false,
        successCallback: () => {
          this.updateAuthorFollowState(true) // 关注之后的回调不传参数，取消关注之后的回调传true以示区分
          message.success('取消关注成功！')
        },
        failCallback() {
          message.error('取消关注失败！')
        }
      }
    })
  }
  render() {
    let { followState, authorId, userId, commonIconBtnProps = {} } = this.props
    let { HAS_BEEN_FOLLOWED, NO_RELATIONSHIP } = config.author

    let toFollow = (followState === HAS_BEEN_FOLLOWED) ||
      (followState === NO_RELATIONSHIP)
    let newBtnProps = this.getBtnProps(followState)
    console.log(toFollow)
    return (
      toFollow ? (
        <Debounce
          btnProps={newBtnProps}
          userId={userId}
          actionType="userBehaviors/followAuthor"
          extraPayload={{ authorId, follow: true }}
          update={this.updateAuthorFollowState}
          btn={<IconBtn type="plus" {...commonIconBtnProps} />}
        />
      ) : (
        <Popover content={
          <ul className={styles.popoverBtns}>
            <li>
              <a
                href="javascript:void(0);"
                className={styles.popoverItem}
                onClick={this.unfollowAuthor}
              >取消关注</a>
            </li>
          </ul>
        }>
          <IconBtn {...commonIconBtnProps} {...newBtnProps} />
        </Popover>
      )
    );
  }
}

UserFollowState.propTypes = {
  userId: PropTypes.number,
  authorId: PropTypes.number,
  followState: PropTypes.number,
  commonIconBtnProps: PropTypes.object
};

export default UserFollowState;
