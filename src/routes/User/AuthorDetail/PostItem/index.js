import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Icon, Popover } from 'antd'
import dayjs from 'dayjs'

import styles from './index.scss'
import config from 'config/constants'
import Confirm from 'components/common/Confirm'
import IconBtn from "components/common/IconBtn";

class PostItem extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    let { isDraft, guest, title, time, approvalNum, scanNum, commentNum } = this.props
    let commonIconOpt = {
      type: 'icon',
      iconSize: '.24rem',
      fontSize: '.2rem',
      btnPadding: '.2rem',
      color: '#666'
    }
    return (
      <div className={styles.postItem}>
        <header className={styles.header}>
          <div className={styles.title}>
            <h4>[求助]{title}</h4>
            {guest ? null : <i className={styles.editIcon}><Icon type="edit" /></i>}
          </div>
          {
            guest ? null : (
              <Popover content={
                <ul className="no-margin">
                  <li>
                    <Confirm
                      triggerModalBtn={<a href="javascript:void(0);" className={styles.popoverItem}>删除</a>}
                      modalTitle="提示"
                    >
                      <p>确定删除该帖子吗？</p>
                    </Confirm>
                  </li>
                </ul>
              } placement="bottomRight">
                <i
                  className={styles.more}
                  style={{ backgroundImage: `url(${config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)` }}
                ></i>
              </Popover>
            )
          }
        </header>
        <footer className={styles.footer}>
          <time>{dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')}</time>
          {
            isDraft ?
            <p className={styles.wordCount}>共&nbsp;234&nbsp;字</p>
            :
            <div className={styles.iconBtnWrapper}>
              <IconBtn iconType="eye" iconBtnText={`${scanNum}人看过`} {...commonIconOpt} />
              <IconBtn iconType="heart" iconBtnText={`${approvalNum}人喜欢`} {...commonIconOpt} />
              <IconBtn iconType="message" iconBtnText={`${commentNum}人评论`} {...commonIconOpt} />
            </div>
          }
        </footer>
      </div>
    );
  }
}

PostItem.propTypes = {
  guest: PropTypes.bool,
  isDraft: PropTypes.bool
};

export default connect()(PostItem);
