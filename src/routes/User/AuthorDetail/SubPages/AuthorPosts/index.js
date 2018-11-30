import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Tabs, Button} from 'antd'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

class AuthorPosts extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    let showDraftBtn = <div className={styles.draftBtn}><Button icon='file-text'>草稿箱</Button></div>
    return (
      <Tabs tabBarExtraContent={showDraftBtn}>
        <Tabs.TabPane tab={`我的分享帖(${5})`} key="sharePosts">
          <ul className={styles.postList}>
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
          </ul>
        </Tabs.TabPane>
        <Tabs.TabPane tab={`我的求助帖(${5})`} key="helpPosts">
          <ul className={styles.postList}>
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
            <PostItem view={255} like={768} comment={22} />
          </ul>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
