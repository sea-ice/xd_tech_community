import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router'

import {Row, Col, Affix, Menu} from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import AuthorBasicInfo from 'AuthorDetail/SubPages/AuthorBasicInfo'
import AuthorPosts from 'AuthorDetail/SubPages/AuthorPosts'
import DraftBin from 'AuthorDetail/SubPages/DraftBin'
import AuthorCollection from 'AuthorDetail/SubPages/AuthorCollection'
import AuthorFollow from 'AuthorDetail/SubPages/AuthorFollow'
import TagManage from 'AuthorDetail/SubPages/TagManage'
import { getSearchObj } from 'utils'

@withRouter
@connect()
class OwnerAuthorDetail extends Component {
  constructor (props) {
    super(props)
    this.authorDetailTabs = [['basic-info'], ['my-post', 'draft-bin'], ['my-collection'], ['my-follow'], ['follow-me'], ['tag-manage']];

    this.state = this.getURLSearchState(props.history.location)
    this.changeTab = this.changeTab.bind(this)
  }
  UNSAFE_componentWillReceiveProps () {
    let { location, history } = this.props
    if (
      // 用户刷新地址栏、点击前进后退均属于POP操作
      // history.action === 'POP' ||
      (history.action === 'PUSH' && location.search !== history.location.search)
    ) {
      // 旧props中的location保存当前UI渲染对应的路径信息
      // 而history.location保存当前最新的路径信息，即浏览器地址栏中的信息
      // push新的路径，浏览器地址栏会更新，但如果没有通过setState设置正确的selectedTab，UI并不会更新
      this.setState(this.getURLSearchState(history.location))
    }
  }
  getURLSearchState (location) {
    let { tab } = getSearchObj(location)
    let selected = ['basic-info'],
        subPage = 'basic-info'
    if (tab) {
      let targetTabs = this.authorDetailTabs.find(
        tabs => ~tabs.indexOf(tab))
      if (targetTabs) {
        selected = [targetTabs[0]]
        subPage = tab
      }
    }
    // console.log({selectedTab: selected, subPage})
    return { selectedTab: selected, subPage }
  }
  changeTab ({key}) {
    let {dispatch, authorId} = this.props
    dispatch(routerRedux.push({
      pathname: `/author/${authorId}`,
      search: `?tab=${key}`
    }))
  }
  render () {
    let { selectedTab, subPage } = this.state

    switch (subPage) {
      case 'basic-info':
        subPage = <AuthorBasicInfo guest={false} />
        break
      case 'my-post':
        subPage = <AuthorPosts guest={false} />
        break
      case 'draft-bin':
        subPage = <DraftBin />
        break
      case 'my-collection':
        subPage = <AuthorCollection guest={false} />
        break
      case 'my-follow':
        subPage = <AuthorFollow followed={false} guest={false} />
        break
      case 'follow-me':
        subPage = <AuthorFollow followed={true} guest={false} />
        break
      case 'tag-manage':
        subPage = <TagManage />
        break
      default:
        subPage = <AuthorBasicInfo guest={false} />
        break
    }
    return (
      <Row gutter={20}>
        <Col span={6}>
          <Affix offsetTop={108}>
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
          <div className={styles.subPageWrapper}>
            <div className={styles.subPage}>{subPage}</div>
          </div>
        </Col>
      </Row>
    );
  }
}

OwnerAuthorDetail.propTypes = {
  authorId: PropTypes.number,
};

export default OwnerAuthorDetail;
