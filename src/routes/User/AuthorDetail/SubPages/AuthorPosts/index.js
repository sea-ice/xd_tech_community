import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Button, Spin, Pagination, Icon } from 'antd'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

@connect(state => ({
  authorId: state.author.validAuthorId,
  sharePosts: state.author.sharePosts,
  appealPosts: state.author.appealPosts,
}))
class AuthorPosts extends Component {
  constructor (props) {
    super(props)
    this.showDraftBin = this.showDraftBin.bind(this)
    this.onSharePostPageChange = this.onPostPageChange.bind(this, 'share')()
    this.onAppealPostPageChange = this.onPostPageChange.bind(this, 'appeal')()
  }
  componentDidMount() {
    let { authorId, dispatch } = this.props
    dispatch({
      type: 'author/getAuthorPosts',
      payload: {
        type: 'share',
        authorId,
        page: 1,
        number: 10
      }
    })
  }
  showDraftBin () {
    let {dispatch} = this.props
    dispatch(routerRedux.push(`/author/1?tab=draft-bin`))
  }
  onPostPageChange(type) {
    return page => {
      let { dispatch, authorId } = this.props
      dispatch({
        type: 'author/getAuthorPosts',
        payload: {
          type,
          authorId,
          page,
          number: 10
        }
      })
    }
  }
  render () {
    let { guest, sharePosts, appealPosts } = this.props

    let iconStyle = {fontSize: 60, color: '#999'}
    return (
      <Tabs tabBarExtraContent={
        guest ? null : (
          <div className={styles.draftBtn}>
            <Button icon='file-text' onClick={this.showDraftBin}>草稿箱</Button>
          </div>
        )
      }>
        <Tabs.TabPane tab={`${guest ? 'Ta' : '我'}的分享帖(${sharePosts.total})`} key="sharePosts">
          <div className={styles.postList}>
            {
              (({ loading, error, total, posts, currentPage }) => (
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
                          {guest ?
                            <p>Ta还没有发布过分享帖</p> :
                            <p>你还没有发布过分享帖，<a href="javascript:void(0);">去发布</a></p>}
                      </div>
                    ) : (
                      <React.Fragment>
                        {posts.map(item => (
                          <PostItem
                            key={item.articleId}
                            guest={guest} {...item}
                            updateCurrentPage={() => this.onSharePostPageChange(currentPage)}
                          />))}
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
              ))(sharePosts)
            }
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${guest ? 'Ta' : '我'}的求助帖(${appealPosts.total})`} key="appealPosts">
          <div className={styles.postList}>
            {
              (({ loading, error, total, posts, currentPage }) => (
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
                          {guest ?
                            <p>Ta还没有发布过求助帖</p> :
                            <p>你还没有发布过求助帖，<a href="javascript:void(0);">去发布</a></p>}
                      </div>
                    ) : (
                      <React.Fragment>
                        {posts.map(item => (
                          <PostItem
                            key={item.articleId}
                            guest={guest} {...item}
                            updateCurrentPage={() => this.onAppealPostPageChange(currentPage)}
                          />))}
                        {
                          total > 10 ? (
                            <div className={styles.paginatorWrapper}>
                              <Pagination total={total} defaultCurrent={currentPage}
                                onChange={this.onAppealPostPageChange} />
                            </div>
                          ) : null
                        }
                      </React.Fragment>
                    )
                  )
                )
              ))(appealPosts)
            }
          </div>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default (AuthorPosts);
