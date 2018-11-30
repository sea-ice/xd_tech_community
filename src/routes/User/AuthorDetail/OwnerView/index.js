import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'

import {Row, Col, Affix, Menu} from 'antd'

import styles from './index.scss'
import AuthorBasicInfo from 'AuthorDetail/SubPages/AuthorBasicInfo'
import AuthorPosts from 'AuthorDetail/SubPages/AuthorPosts'
import AuthorCollection from 'AuthorDetail/SubPages/AuthorCollection'
import AuthorFollowing from 'AuthorDetail/SubPages/AuthorFollowing'
import AuthorFollowed from 'AuthorDetail/SubPages/AuthorFollowed'
import TagManage from 'AuthorDetail/SubPages/TagManage'
import {getRootFontSize, getSearchObj} from 'utils'

class OwnerAuthorDetail extends Component {
  constructor (props) {
    super(props)
    this.authorDetailTabs = ['basic-info', 'my-post', 'my-collection', 'my-follow', 'follow-me', 'tag-manage']
    this.state = this.getInitialState()

    this.changeTab = this.changeTab.bind(this)
  }
  getInitialState () {
    let {tab} = getSearchObj()
    let selected = ['basic-info']
    if (tab && (this.authorDetailTabs.indexOf(tab) > 0)) {
      selected = [tab]
    }
    return {selectedTab: selected}
  }
  changeTab ({key}) {
    let {dispatch, id} = this.props
    dispatch(routerRedux.push(`/author/${id}?tab=${key}`))
  }
  render () {
    let documentEleFontSize = getRootFontSize()
    let {selectedTab} = this.state

    let subPage
    switch (selectedTab[0]) {
      case 'basic-info':
        subPage = <AuthorBasicInfo guest={false} />
        break
      case 'my-post':
        subPage = <AuthorPosts guest={false} />
        break
      case 'my-collection':
        subPage = <AuthorCollection guest={false} />
        break
      case 'my-follow':
        subPage = <AuthorFollowing guest={false} />
        break
      case 'follow-me':
        subPage = <AuthorFollowed guest={false} />
        break
      case 'tag-manage':
        subPage = <TagManage />
        break
      default: break
    }
    return (
      <Row gutter={20}>
        <Col span={6}>
          <Affix offsetTop={1.8 * documentEleFontSize}>
            <aside className={styles.menuWrapper}>
              <Menu theme="light" defaultSelectedKeys={selectedTab} onClick={this.changeTab}>
                <Menu.Item key="basic-info">基本信息</Menu.Item>
                <Menu.Item key="my-post">我的帖子</Menu.Item>
                <Menu.Item key="my-collection">我的收藏</Menu.Item>
                <Menu.Item key="my-follow">我关注的人</Menu.Item>
                <Menu.Item key="follow-me">关注我的人</Menu.Item>
                <Menu.Item key="tag-manage">标签管理</Menu.Item>
              </Menu>
            </aside>
          </Affix>
        </Col>
        <Col span={18}>
          <div className={styles.subPage}>{subPage}</div>
        </Col>
      </Row>
    );
  }
}

OwnerAuthorDetail.propTypes = {
};

export default connect()(OwnerAuthorDetail);
