// 我关注的人
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Input, Icon, Pagination, Spin } from 'antd';

import styles from './index.scss'
import FollowUserItem from './FollowUserItem'

class AuthorFollow extends Component {
  state = {
    keywords: ''
  }
  constructor(props) {
    super(props)
    this.onSearchKeywordChange = this.onSearchKeywordChange.bind(this)
    this.clearKeywords = this.clearKeywords.bind(this)
    this.onSharePostPageChange = this.onSharePostPageChange.bind(this)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { followed } = nextProps
    if (followed !== this.props.followed) {
      let { dispatch, authorId } = this.props
      dispatch({
        type: 'author/getFollowUserList',
        payload: {
          authorId,
          followed,
          keywords: '',
          page: 1,
          number: 10
        }
      })
      this.setState({ keywords: '' })
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
        keywords: '',
        page: 1,
        number: 10
      }
    })
  }
  onSearchKeywordChange(e) {
    let keywords = e.target.value
    this.setState({ keywords })

    if (this.searchTimer) window.clearTimeout(this.searchTimer)
    if (!!keywords) {
      this.searchTimer = setTimeout(() => {
        let { dispatch, authorId, followed } = this.props
        // 这里的authorId是当前正在访问的个人主页对应的用户id
        dispatch({
          type: 'author/getFollowUserList',
          payload: {
            authorId,
            followed,
            keywords: keywords.trim()
          }
        })
      }, 1000)
    } else {
      this.clearSearchResult()
    }
  }
  clearKeywords() {
    this.setState({ keywords: '' })
    this.clearSearchResult()
  }
  clearSearchResult(value) {
    let { dispatch, followed } = this.props
    dispatch({
      type: 'author/clearSearchResult',
      payload: {
        followed
      }
    })
  }
  onSharePostPageChange(page) {
    let { dispatch, authorId, followed } = this.props
    // 这里的authorId是当前正在访问的个人主页对应的用户id
    dispatch({
      type: 'author/getFollowUserList',
      payload: {
        authorId,
        followed,
        keywords: '',
        page,
        number: 10
      }
    })
  }
  render () {
    let { guest, followed, followingUsers, followedUsers } = this.props
    let targetAuthorFollowInfo = followed ? followedUsers : followingUsers
    let iconStyle = { fontSize: 60, color: '#999' }
    let { users, currentPage, total = 0, loading, error, searchError, searchResult, searchKeywords } = targetAuthorFollowInfo

    let { keywords } = this.state
    let suffix = !!keywords ? <Icon type="close" onClick={this.clearKeywords} /> : null
console.log(targetAuthorFollowInfo)
    return (
      <div className={styles.listWithHeader}>
        <header className={styles.header}>
          <h4>{followed ? `关注${guest ? 'TA' : '我'}的` : `${guest ? 'TA' : '我'}关注的`}({total})</h4>
          {(guest || !total) ? null : (
            <div className={styles.searchWrapper}>
              <Input
                placeholder="输入昵称搜索"
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={suffix}
                value={keywords}
                onChange={this.onSearchKeywordChange}
                ref={node => this.userNameInput = node}
              />
            </div>
          )}
        </header>
        <div className="followItemWrapper">
          {
            (() => {
              if (loading) return <div className={styles.spinWrapper}><Spin tip="加载中..." /></div>
              if (error || searchError) return (
                <div className={styles.iconWrapper}>
                  <Icon type="frown" style={iconStyle} />
                  <p>{error ? '加载' : '搜索'}失败，请稍后再试！</p>
                </div>
              )
              if (searchResult) {
                return !!searchResult.length ? (
                  searchResult.map(item => (
                    <FollowUserItem key={item.userId} {...item} />))
                ): (
                  <div className={styles.iconWrapper}>
                    <Icon type="inbox" style={iconStyle} />
                    <p>无匹配结果</p>
                  </div>
                )
              }
              if (!!total) {
                return (
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
              } else {
                return (
                  <div className={styles.iconWrapper}>
                    <Icon type="inbox" style={iconStyle} />
                    {followed ? (
                      <p>还没有关注{guest ? 'TA' : '你'}</p>
                    ) : (
                      <p>{guest ? 'TA' : '你'}还没有关注任何人</p>
                    )}
                  </div>
                )
              }
            })()
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
