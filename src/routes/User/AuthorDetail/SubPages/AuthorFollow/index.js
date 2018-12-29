// 我关注的人
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Input, Icon, Pagination, Spin } from 'antd';

import styles from './index.scss'
import FollowUserItem from './FollowUserItem'

class AuthorFollow extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { followed } = nextProps
    if (followed !== this.props.followed) {
      let { dispatch, authorId } = this.props
      dispatch({
        type: 'author/getFollowUserList',
        payload: {
          authorId,
          followed,
          page: 1,
          number: 10
        }
      })
    }
  }
  UNSAFE_componentWillMount() {
    let { dispatch, authorId, followed } = this.props
    // 这里的authorId是当前正在访问的个人主页对应的用户id
    dispatch({
      type: 'author/getFollowUserList',
      payload: {
        authorId,
        followed,
        page: 1,
        number: 10
      }
    })
  }
  render () {
    let { guest, followed, followingUsers, followedUsers } = this.props
    let targetAuthorFollowInfo = followed ? followedUsers : followingUsers
    let iconStyle = { fontSize: 60, color: '#999' }
    let { users, currentPage, total = 0, loading, error } = targetAuthorFollowInfo

    return (
      <div className={styles.listWithHeader}>
        <header className={styles.header}>
          <h4>{followed ? `关注${guest ? 'Ta' : '我'}的` : `${guest ? 'Ta' : '我'}关注的`}({total})</h4>
          {guest ? null : (
            <div className={styles.searchWrapper}>
              <Input.Search
                placeholder="输入昵称搜索"
                onSearch={this.handleUserSearch}
                enterButton />
            </div>
          )}
        </header>
        <div className="followItemWrapper">
          {
            loading ? <div className={styles.spinWrapper}><Spin tip="加载中..." /></div> : (
              error ? (
                <div className={styles.iconWrapper}>
                  <Icon type="frown" style={iconStyle} />
                  <p>加载失败，请稍后再试！</p>
                </div>
              ) : (
                  !total ? (
                    <div className={styles.iconWrapper}>
                      <Icon type="inbox" style={iconStyle} />
                      {followed ? (
                        <p>还没有关注{guest ? 'Ta' : '你'}</p>
                      ) : (
                        <p>{guest ? 'Ta' : '你'}还没有关注任何人</p>
                      )}
                    </div>
                  ) : (
                      <React.Fragment>
                        {users.map(item => (
                          <FollowUserItem key={item.userId} {...item} />))}
                        {
                          total > 10 ? (
                            <div className={styles.paginatorWrapper}>
                              <Pagination total={total} defaultCurrent={currentPage}
                                onChange={this.onSharePostPageChange} />
                            </div>
                          ) : null
                        }
                      </React.Fragment>
                    )
                )
            )
          }
        </div>
      </div>
    );
  }
}

AuthorFollow.propTypes = {
  guest: PropTypes.bool
};

export default connect(state => ({
  loginUserId: state.user.userId,
  authorId: state.author.validAuthorId,
  followingUsers: state.author.followingUsers,
  followedUsers: state.author.followedUsers
}))(AuthorFollow);
