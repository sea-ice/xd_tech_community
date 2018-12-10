import React, {Component} from 'react';
import { connect } from 'dva';
import {Row, Col, Tabs} from 'antd'

// import config from 'config/constants'
import {checkLogin} from 'utils'

import styles from './index.css'
import FixedHeader from 'components/common/FixedHeader'
import IconBtn from 'components/common/IconBtn'
import SharePostFilterByLabel from 'components/SharePostFilterByLabel'
import StickPostItem from 'components/Post/StickPostItem'
import PlainPostItem from 'components/Post/PlainPostItem';

class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.bindHandlers()
    // let {dispatch} = this.props
    // dispatch({type: 'recommendSharePost/getPageData', payload: {page: 1}})
  }
  bindHandlers() {
    this.toggleCollapse = this.toggleCollapse.bind(this)
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
  render () {
    let {
      postFilterCollapse,
      recommendSharePosts,
      recommendHelpPosts,
      stickSharePosts,
      confirmedTags
    } = this.props

    let postFilterIconOpt = {
      lineHeight: '45px',
      onIconClick: this.toggleCollapse
    }
    let filterIconBtn = postFilterCollapse ? <IconBtn
      iconClassName={styles.filterIcon}
      iconBtnText="筛选"
      {...postFilterIconOpt} /> : <IconBtn
      iconClassName={styles.collapseIcon}
      iconBtnText="收起"
      {...postFilterIconOpt} />

    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={16}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={filterIconBtn}>
                  <Tabs.TabPane tab="分享" key="sharePosts">
                    <SharePostFilterByLabel />
                    <ul>
                      {
                        confirmedTags.length ? null : stickSharePosts.map(p => <StickPostItem key={p.articleId} {...p} />)
                      }
                      {
                        recommendSharePosts.map(
                          p => <PlainPostItem key={p.articleId} {...p} />)
                      }
                    </ul>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="求助" key="helpPosts">
                    <SharePostFilterByLabel />
                    <ul>
                      {
                        recommendHelpPosts.map(
                          p => <PlainPostItem key={p.articleId} {...p} />)
                      }
                    </ul>
                  </Tabs.TabPane>
                  {/* <Tabs.TabPane tab="关注" key="attention">
                  </Tabs.TabPane> */}
                </Tabs>
              </div>
            </Col>
            <Col span={8}>

            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default checkLogin({
  *checkLoginFinish(userInfo, {put}) {
    yield [
      put({
        type: 'postFilterState/initPostFilter',
        payload: { userInfo }
      }),
      put({
        type: 'firstScreenRender/indexPage',
        payload: { userInfo }
      })
    ]
  }
})(connect(state => ({
  postFilterCollapse: state.postFilterState.collapse,
  stickSharePosts: state.indexStickPosts.share,
  // stickHelpPosts: state.indexStickPosts.help,
  recommendSharePosts: state.recommendPosts.share,
  recommendHelpPosts: state.recommendPosts.help,
  confirmedTags: state.postFilterState.confirmedTags
}))(IndexPage));
