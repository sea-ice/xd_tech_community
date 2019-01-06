import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Breadcrumb } from 'antd'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

@connect(state => ({
  loginUserId: state.user.userId,
}))
class DraftBin extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    let { loginUserId } = this.props
    return (
      <div className={styles.listWithHeader}>
        <header className={styles.breadCrumbWrapper}>
          <p>当前位置：</p>
          <Breadcrumb>
            <Breadcrumb.Item ><a href={`/author/${loginUserId}?tab=my-post`}>我的帖子</a></Breadcrumb.Item>
            <Breadcrumb.Item>草稿箱(4)</Breadcrumb.Item>
          </Breadcrumb>
        </header>
        <div className="list">

        </div>
      </div>
    );
  }
}

DraftBin.propTypes = {
};

export default DraftBin;
