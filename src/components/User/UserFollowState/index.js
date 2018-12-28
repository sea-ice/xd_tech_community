import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Popover, Button } from 'antd'

import config from 'config/constants'
import styles from './index.scss'
import Debounce from 'components/common/Debounce'


@connect(state => ({
  userId: state.user.userId
}))
class UserFollowState extends Component {
  state = {
    loading: false
  }
  constructor(props) {
    super(props)
    this.getBtnLoadingState = this.getBtnLoadingState.bind(this)
    this.updateAuthorFollowState = this.updateAuthorFollowState.bind(this)
  }
  getBtnProps(state) {
    let { loading } = this.state
    if (loading) return { loading: true, children: '加载中...' }
    let {
      HAS_BEEN_FOLLOWED,
      NO_RELATIONSHIP,
      HAS_FOLLOWED,
      MUTUAL_FOLLOW } = config.author
    switch (state) {
      case HAS_BEEN_FOLLOWED:
      case NO_RELATIONSHIP:
        return { icon: 'plus', children: '关注' }
      case HAS_FOLLOWED:
        return { icon: 'user', children: '已关注' }
      case MUTUAL_FOLLOW:
        return { icon: 'swap', children: '互相关注' }
      default: break
    }
  }
  getBtnLoadingState(loading) {
    this.setState({ loading })
  }
  updateAuthorFollowState(unfollow) {
    // 关注之后的回调不传参数，取消关注之后的回调传true以示区分
    let { followState, updateSuccessCallback } = this.props
    let {
      HAS_BEEN_FOLLOWED,
      NO_RELATIONSHIP,
      HAS_FOLLOWED,
      MUTUAL_FOLLOW
    } = config.author
    let newFollowState
    if (unfollow) { // 当前是未关注
      newFollowState = followState === MUTUAL_FOLLOW ? HAS_BEEN_FOLLOWED : NO_RELATIONSHIP
    } else {
      newFollowState = followState === HAS_BEEN_FOLLOWED ? MUTUAL_FOLLOW : HAS_FOLLOWED
    }
    if (updateSuccessCallback) updateSuccessCallback(newFollowState)
  }

  render() {
    let { followState, authorId, userId, customBtnProps = {} } = this.props
    let { HAS_BEEN_FOLLOWED, NO_RELATIONSHIP } = config.author

    let toFollow = (followState === HAS_BEEN_FOLLOWED) ||
      (followState === NO_RELATIONSHIP)
    let newBtnProps = this.getBtnProps(followState)

    return (
      toFollow ? (
        <Debounce
          btnProps={newBtnProps}
          userId={userId}
          actionType="userBehaviors/followAuthor"
          extraPayload={{ authorId, follow: true }}
          notifyLoading={this.getBtnLoadingState}
          update={this.updateAuthorFollowState}
          btn={<Button {...customBtnProps}></Button>}
        />
      ) : (
        <Popover content={
          <ul className={styles.popoverBtns}>
            <li>
              <Debounce
                userId={userId}
                actionType="userBehaviors/followAuthor"
                extraPayload={{ authorId }}
                notifyLoading={this.getBtnLoadingState}
                update={() => this.updateAuthorFollowState(true)}
                btn={
                  <a
                    href="javascript:void(0);"
                    className={styles.popoverItem}
                  >取消关注</a>
                }
              />
            </li>
          </ul>
        }>
          <Button {...customBtnProps} {...newBtnProps} />
        </Popover>
      )
    );
  }
}

UserFollowState.propTypes = {
  userId: PropTypes.number,
  authorId: PropTypes.number,
  followState: PropTypes.number,
  customBtnProps: PropTypes.object
};

export default UserFollowState;
