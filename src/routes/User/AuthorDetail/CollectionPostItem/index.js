import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Icon, Popover, message } from 'antd'
import dayjs from 'dayjs'

import styles from './index.scss'
import config from 'config/constants'
import Confirm from 'components/common/Confirm'
import IconBtn from "components/common/IconBtn";
import CollectionPanel from 'components/Post/CollectionPanel'

@connect(state => ({
  loginUserId: state.user.userId,
  collections: state.collection.all
}))
class CollectionPostItem extends Component {
  constructor(props) {
    super(props)
    this.turnToPostDetails = this.turnToPostDetails.bind(this)
    this.saveSuccessCallback = this.saveSuccessCallback.bind(this)
    this.saveFailCallback = this.saveFailCallback.bind(this)
    this.removePost = this.removePost.bind(this)
  }
  turnToPostDetails() {
    let { dispatch, articleId } = this.props
    dispatch(routerRedux.push(`/post/${articleId}`))
  }
  saveSuccessCallback(resolve, newFavoriteDir) {
    // 将帖子成功移到其他收藏夹的回调
    return () => {
      // 收藏成功之后需要更新收藏夹状态
      // 对于移除帖子的收藏夹需要调用从收藏夹移除帖子的接口
      this.removePost()
      this.refreshPostPage(newFavoriteDir) // 刷新帖子移入的收藏夹
      message.success('操作成功！')
      resolve(true) // 隐藏对话框
    }
  }
  saveFailCallback(reject) {
    return () => {
      message.error('操作失败！')
      reject()
    }
  }
  removePost() {
    let { dispatch, articleId, loginUserId, favoriteDir } = this.props

    dispatch({
      type: 'userBehaviors/collectPost',
      payload: {
        userId: loginUserId,
        postId: articleId,
        favoriteDir,
        cancel: true,
        successCallback: () => {
          this.refreshPostPage(favoriteDir)
        }
      }
    })
  }
  refreshPostPage(collectionName) {
    let { dispatch, collections, loginUserId } = this.props
    let c = collections.find(item => item.favoriteDir === collectionName)
    let { currentPage = 1 } = c
    dispatch({
      type: 'collection/getCollectionPosts',
      payload: {
        userId: loginUserId, // 移动收藏夹中的帖子的用户就是当前登录的用户
        favoriteDir: collectionName,
        page: currentPage,
        number: 5
      }
    })
  }
  render() {
    let { loginUserId, guest, favoriteDir, articleId, title, time, approvalNum, scanNum, commentNum } = this.props

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
            <h4 onClick={this.turnToPostDetails}>{title}</h4>
          </div>
          {
            guest ? null : (
              <Popover content={
                <ul className={styles.popoverBtns}>
                  <li>
                    <CollectionPanel
                      initSelectedFavoriteDir={favoriteDir}
                      noLoading={true}
                      // noLoading选项很重要，避免收藏夹列表重新加载，重新加载会导致点击修改帖子的收藏夹时
                      // 对话框组件无法显示，因为在重新加载时原来的CollectionPostItem组件被卸载了
                      userId={loginUserId} postId={articleId} btn={
                        <a href="javascript:void(0);" className={styles.popoverItem}>移至其他收藏夹</a>
                      }
                      disabledFavoriteDir={[favoriteDir]}
                      saveSuccessCallback={this.saveSuccessCallback}
                      saveFailCallback={this.saveFailCallback}
                    />
                  </li>
                  <li>
                    <Confirm
                      triggerModalBtn={<a href="javascript:void(0);" className={styles.deleteBtn}>从此收藏夹移除</a>}
                      modalTitle="提示"
                      handleOk={this.removePost}
                    >
                      <p>确定从该收藏夹中移除该帖子吗？</p>
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
          <div className={styles.iconBtnWrapper}>
            {/* <IconBtn iconType="eye" iconBtnText={`${scanNum}人看过`} {...commonIconOpt} /> */}
            <IconBtn iconType="heart" iconBtnText={`${approvalNum}人喜欢`} {...commonIconOpt} />
            <IconBtn iconType="message" iconBtnText={`${commentNum}人评论`} {...commonIconOpt} />
          </div>
        </footer>
      </div>
    );
  }
}

CollectionPostItem.propTypes = {
  guest: PropTypes.bool,
  favoriteDir: PropTypes.string
};

export default CollectionPostItem;
