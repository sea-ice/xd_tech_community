import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Icon, Popover} from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import IconBtn from "components/common/IconBtn";

class PostItem extends Component {
  constructor (props) {
    super(props)

    this.delPostTemplate = <ul className="no-margin">
      <li>
        <Confirm
          triggerModalBtn={<a href="javascript:void(0);" className={styles.popoverItem}>删除</a>}
          modalTitle="提示"
        >
          <p>确定删除该帖子吗？</p>
        </Confirm>
      </li>
    </ul>
  }
  render () {
    let {view, like, comment} = this.props
    let commonIconOpt = {
      type: 'icon',
      iconSize: '.24rem',
      fontSize: '.2rem',
      btnPadding: '.2rem',
      color: '#666'
    }
    return (
      <li className={styles.postItem}>
        <header className={styles.header}>
          <div className={styles.title}>
            <h4>[求助]炫酷粒子表白，双十一脱单靠它了！</h4>
            <i className={styles.editIcon}><Icon type="edit" /></i>
          </div>
          <div className={styles.timeWrapper}>
            <time>2018/11/29 12:44</time>
            <Popover content={this.delPostTemplate} placement="bottomRight">
              <i className={styles.more}></i>
            </Popover>
          </div>
        </header>
        <footer className={styles.footer}>
          <IconBtn iconType="eye" iconBtnText={`${view}人看过`} {...commonIconOpt} />
          <IconBtn iconType="heart" iconBtnText={`${like}人喜欢`} {...commonIconOpt} />
          <IconBtn iconType="message" iconBtnText={`${comment}人评论`} {...commonIconOpt} />
        </footer>
      </li>
    );
  }
}

PostItem.propTypes = {
  guest: PropTypes.bool
};

export default connect()(PostItem);
