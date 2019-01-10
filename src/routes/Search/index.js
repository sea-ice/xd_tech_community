import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Row, Col, Spin} from 'antd'
import { checkLogin, searchListPost } from 'utils'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import PullupLoadMore from 'components/common/PullupLoadMore'
import PlainPostItem from 'components/Post/PlainPostItem'


class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.getSearchPageDate = this.getPageData.bind(this)()
  }

  getPageData() {
    return (page) => new Promise((resolve, reject) => {
      let { dispatch, userInfo, confirmedTags } = this.props
      dispatch({
        type: 'searchPost/getPageData',
        payload: Object.assign(
           {
            successCallback: (res) => {
              // res为响应
              let { data: { code } } = res
              console.log(res)
              let result = {}
              if (code === 216) {
                result = { noMoreData: true }
              }
              resolve(result)
            }
          }
        )
      })
    })
  }
  
  resetPullupState() {
    // 重置上拉加载组件为初始状态
    this.sharePullup.resetState()
    if (this.appealPullup) { // 有可能求助帖列表页面还没有渲染
      this.appealPullup.resetState()
    }
  }

  render () {
    this.getPageData()
    let {
      firstLoading,
      postFilterCollapse,
      searchListPosts
    } = this.props
    return (
      <div>
        <FixedHeader />
        <main className="app-main">
       
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                
                <PullupLoadMore
                  initPageNum={1}
                  onRef={c => this.appealPullup = c}
                  getPageData={this.getSearchPageDate}
                >
                  <ul className={styles.postList}>
                    {
                      searchListPosts.map(
                        p => <PlainPostItem key={p.articleId} {...p} />)
                    }
                  </ul>
                  {firstLoading ? (
                    <div className={styles.spinWrapper}><Spin tip="加载中..." /></div>
                  ) : null}
                </PullupLoadMore>
            
                
              </div>
            
            </Col>
            <Col span={6}>

            </Col>
          </Row>
          
        </main>
      </div>
    );
  }
}

PostDetail.propTypes = {
};

export default checkLogin({
  *checkLoginFinish(userInfo, { all, put }) {
    yield all([
      put({
        type: 'postFilterState/initPostFilter',
        payload: { userInfo }
      }),
      put({
        type: 'firstScreenRender/indexPage',
        payload: { userInfo }
      })
    ])
  }
})(connect(state => ({
  userInfo: state.user.userInfo,
  firstLoading: state.recommendPosts.firstLoading,
  postFilterCollapse: state.postFilterState.collapse,
  stickSharePosts: state.indexStickPosts.share,
  recommendSharePosts: state.recommendPosts.share,
  recommendAppealPosts: state.recommendPosts.appeal,
  confirmedTags: state.postFilterState.confirmedTags,
  searchListPosts: state.searchPost.list
}))(PostDetail));
