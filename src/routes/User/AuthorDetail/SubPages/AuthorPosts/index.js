import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {Tabs, Button} from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import PostItem from 'AuthorDetail/PostItem'

class AuthorPosts extends Component {
  constructor (props) {
    super(props)
    this.showDraftBin = this.showDraftBin.bind(this)
  }
  showDraftBin () {
    let {dispatch} = this.props
    console.log('show draft bin')
    dispatch(routerRedux.push(`/author/1?tab=draft-bin`))
  }
  render () {
    let showDraftBtn = <div className={styles.draftBtn}><Button icon='file-text' onClick={this.showDraftBin}>草稿箱</Button></div>
    return (
      <Tabs tabBarExtraContent={showDraftBtn}>
        <Tabs.TabPane tab={`我的分享帖(${5})`} key="sharePosts">
          <div className={styles.postList}>
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`我的求助帖(${5})`} key="helpPosts">
          <div className={styles.postList}>
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
          </div>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
