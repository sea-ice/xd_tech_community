import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Breadcrumb, Icon, Pagination, Spin } from 'antd'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

@connect(state => ({
  loginUserId: state.user.userId,
  drafts: state.author.drafts
}))
class DraftBin extends Component {
  constructor (props) {
    super(props)
    this.onSharePostPageChange = this.onSharePostPageChange.bind(this)
  }
  componentDidMount() {
    let { dispatch, loginUserId } = this.props
    dispatch({
      type: 'author/getAuthorDrafts',
      payload: {
        authorId: loginUserId,
        page: 1,
        number: 10
      }
    })
  }
  onSharePostPageChange(page) {
    let { dispatch, loginUserId } = this.props
    dispatch({
      type: 'author/getAuthorDrafts',
      payload: {
        authorId: loginUserId,
        page,
        number: 10
      }
    })
  }
  render () {
    let { loginUserId, drafts } = this.props
    let { posts, loading, error, currentPage, total = 0 } = drafts

    let iconStyle = { fontSize: 60, color: '#999' }
    return (
      <div className={styles.listWithHeader}>
        <header className={styles.breadCrumbWrapper}>
          <p>当前位置：</p>
          <Breadcrumb>
            <Breadcrumb.Item ><a href={`/author/${loginUserId}?tab=my-post`}>我的帖子</a></Breadcrumb.Item>
            <Breadcrumb.Item>草稿箱({total})</Breadcrumb.Item>
          </Breadcrumb>
        </header>
        <main className={styles.main}>
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
                    <p>空空如也~~</p>
                  </div>
                ) : (
                  <React.Fragment>
                    {posts.map(item => (
                      <PostItem
                        key={item.articleId}
                        isDraft={true} guest={false} {...item}
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
          }
        </main>
      </div>
    );
  }
}

DraftBin.propTypes = {
};

export default DraftBin;
