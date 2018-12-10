import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Breadcrumb } from 'antd'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

class DraftBin extends Component {
  constructor (props) {
    super(props)
  }
  render () {

    return (
      <div>
        <div className={styles.breadCrumbWrapper}>
          <p>当前位置：</p>
          <Breadcrumb>
            <Breadcrumb.Item ><a href="/author/1?tab=my-post">我的帖子</a></Breadcrumb.Item>
            <Breadcrumb.Item>草稿箱</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.listWithHeader}>
          <header className={styles.header}>
            <h4>草稿箱(4)</h4>
          </header>
          <div className="list">
            <PostItem isDraft={true} view={1902} like={243} comment={244} />
            <PostItem isDraft={true} view={1902} like={243} comment={244} />
            <PostItem isDraft={true} view={1902} like={243} comment={244} />
            <PostItem isDraft={true} view={1902} like={243} comment={244} />
          </div>
        </div>
      </div>
    );
  }
}

DraftBin.propTypes = {
  guest: PropTypes.bool
};

export default connect()(DraftBin);
