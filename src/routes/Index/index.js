import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router'
import { Row, Col, Tabs, Icon } from 'antd'

import config from 'config/constants'
import { checkLogin, fillPostListPayload } from 'utils'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import PullupLoadMore from 'components/common/PullupLoadMore'
import SharePostFilterByLabel from 'components/SharePostFilterByLabel'
// import StickPostItem from 'components/Post/StickPostItem'
import PlainPostItem from 'components/Post/PlainPostItem'
// import Template from '../Template'

@checkLogin({
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
})
@connect(state => ({
  userInfo: state.user.userInfo,
  currentTab: state.recommendPosts.lastSelectedTab,
  currentScrollTop: state.recommendPosts.lastScrollTop,
  postFilterCollapse: state.postFilterState.collapse,
  stickSharePosts: state.indexStickPosts.share,
  // stickAppealPosts: state.indexStickPosts.appeal,
  recommendSharePosts: state.recommendPosts.share,
  recommendAppealPosts: state.recommendPosts.appeal,
  confirmedTags: state.postFilterState.confirmedTags
}))
@withRouter
class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.onTabChange = this.onTabChange.bind(this)
    this.getCurrentScrollTop = this.getCurrentScrollTop.bind(this)
    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.getSharePostPageData = this.getPageData.bind(this, 'share')()
    this.getAppealPostPageData = this.getPageData.bind(this, 'appeal')()
    this.resetPullupState = this.resetPullupState.bind(this)
    this.appMain = React.createRef()
    this.scrollListener = React.createRef()

    const { lastSelectedTab = 'sharePosts' } = props
    this.state = { currentTab: lastSelectedTab }
  }
  componentDidMount() {
    let { currentScrollTop } = this.props
    if (currentScrollTop) {
      this.scrollListener.current.scrollTop = currentScrollTop
    }
  }
  onTabChange(activeKey) {
    this.setState({
      currentTab: activeKey
    })
  }
  getCurrentScrollTop() {
    return this.scrollListener.current.scrollTop
  }
  // 切换标签过滤器的收起/展开状态
  toggleCollapse () {
    let {dispatch, postFilterCollapse} = this.props
    dispatch({
      type: 'postFilterState/setState',
      payload: {
        collapse: !postFilterCollapse
      }
    })
  }
  getPageData(postType) {
    return (page) => new Promise((resolve, reject) => {
      let { dispatch, userInfo, confirmedTags } = this.props
      dispatch({
        type: 'recommendPosts/getPageData',
        payload: Object.assign(
          fillPostListPayload(userInfo, postType, page, confirmedTags),
          {
            successCallback: (res) => {
              // res为响应
              let { data: { code } } = res
              let result = {}
              if (code === 216) {
                result = { noMoreData: true }
              }
              resolve(result)
            }
          })
      })
    })
  }
  resetPullupState() {
    // 重置上拉加载组件为初始状态
    if (this.sharePullup) {
      console.log(this.sharePullup)
      this.sharePullup.resetState()
    }
    if (this.appealPullup) { // 有可能求助帖列表页面还没有渲染
      this.appealPullup.resetState()
    }
  }
  render () {
    let {
      postFilterCollapse,
      recommendSharePosts,
      recommendAppealPosts
    } = this.props

    let { currentTab } = this.state

    let filterIconBtn = (
      <a href="javascript:void(0);" onClick={this.toggleCollapse} className={styles.filterBtn}>
        {
          postFilterCollapse ? (
            <React.Fragment>
              <span>筛选</span>
              <i className={styles.spreadIcon} style={{
                backgroundImage: `url(${
                  config.SUBDIRECTORY_PREFIX
                  }/assets/collapse.svg)`
              }}></i>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>收起</span>
              <i className={styles.filterIcon} style={{
                backgroundImage: `url(${
                  config.SUBDIRECTORY_PREFIX
                  }/assets/collapse.svg)`
              }}></i>
            </React.Fragment>
          )}
      </a>
    )

    let iconStyle = { fontSize: 60, color: '#999' }

    return (
      <div className={styles.scrollContainer} ref={this.scrollListener}>
        <FixedHeader />
        <main className={styles.appMain} ref={this.appMain}>
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={filterIconBtn} onChange={this.onTabChange}>
                  <Tabs.TabPane tab="分享" key="sharePosts">
                    <SharePostFilterByLabel resetPullup={this.resetPullupState} />
                    {
                      !!recommendSharePosts.length ? (
                        <PullupLoadMore
                          initPageNum={1}
                          scrollListener={this.scrollListener.current}
                          container={this.appMain.current}
                          loadCondition={() => currentTab === 'sharePosts'}
                          onRef={c => this.sharePullup = c}
                          getPageData={this.getSharePostPageData}
                        >
                          <ul className={styles.postList}>
                            {/* {
                              confirmedTags.length ? null : stickSharePosts.map(p => <StickPostItem key={p.articleId} {...p} />)
                            } */}
                            {
                              recommendSharePosts.map(
                                p => <PlainPostItem
                                  key={p.articleId} {...p}
                                  currentTab={currentTab}
                                  getCurrentScrollTop={this.getCurrentScrollTop}
                                />)
                            }
                          </ul>
                        </PullupLoadMore>
                      ) : (
                        <div className={styles.iconWrapper}>
                          <Icon type="inbox" style={iconStyle} />
                          <p>没有相关的帖子</p>
                        </div>
                      )
                    }
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="求助" key="appealPosts">
                    <SharePostFilterByLabel resetPullup={this.resetPullupState} />
                    {
                      !!recommendAppealPosts.length ? (
                        <PullupLoadMore
                          initPageNum={1}
                          scrollListener={this.scrollListener.current}
                          container={this.appMain.current}
                          loadCondition={() => currentTab === 'appealPosts'}
                          onRef={c => this.appealPullup = c}
                          getPageData={this.getAppealPostPageData}
                        >
                          <ul className={styles.postList}>
                            {
                              recommendAppealPosts.map(
                                p => <PlainPostItem
                                  key={p.articleId} {...p}
                                  currentTab={currentTab}
                                  getCurrentScrollTop={this.getCurrentScrollTop}
                                />)
                            }
                          </ul>
                        </PullupLoadMore>
                      ) : (
                        <div className={styles.iconWrapper}>
                          <Icon type="inbox" style={iconStyle} />
                          <p>没有相关的帖子</p>
                        </div>
                      )
                    }

                  </Tabs.TabPane>
                  {/* <Tabs.TabPane tab="关注" key="attention">
                  </Tabs.TabPane> */}
                </Tabs>
              </div>
            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default IndexPage;
