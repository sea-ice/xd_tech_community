import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Button, Input, Icon, Checkbox, Spin, Pagination, message } from 'antd'

import styles from './index.scss'
import CollectionItem from 'AuthorDetail/CollectionItem'
import Confirm from 'components/common/Confirm'

@connect(state => ({
  authorId: state.author.validAuthorId,
  loadingAll: state.collection.loadingAll,
  collections: state.collection.all,
}))
class AuthorCollection extends Component {
  state = {
    newCollectionName: '',
    deleteAfterClear: false
  }
  constructor (props) {
    super(props)
    this.onNewCollectionNameChange = this.onNewCollectionNameChange.bind(this)
    this.createCollection = this.createCollection.bind(this)
    this.toggleOpenState = this.toggleOpenState.bind(this)
    this.updateCurrentPage = this.updateCurrentPage.bind(this)
    this.resetDeleteAfterClear = this.setDeleteAfterClear.bind(this, false)()
    this.onDeleteAfterClearChange = this.setDeleteAfterClear.bind(this)()
    this.clearCollection = this.clearCollection.bind(this)
  }
  componentDidMount() {
    this.refreshCollections()
  }
  onNewCollectionNameChange(e) {
    this.setState({ newCollectionName: e.target.value })
  }
  createCollection() {
    return new Promise((resolve, reject) => {
      let { dispatch, collections, authorId } = this.props
      let { newCollectionName } = this.state
      // todo: 检查输入的收藏夹名称合法性
      newCollectionName = newCollectionName.trim()
      if (!newCollectionName) {
        message.error('收藏夹名称不允许为空！')
        return reject()
      }
      let hasConflict = collections.find(
        item => item.favoriteDir === newCollectionName)
      if (hasConflict) {
        message.error('收藏夹名称存在冲突！')
        return reject()
      }
      dispatch({
        type: 'collection/new',
        payload: {
          userId: authorId,
          collectionName: newCollectionName,
          successCallback: () => {
            this.setState({
              newCollectionName: ''
            })
            message.success('收藏夹创建成功！')
            resolve(true)
          },
          failCallback() {
            message.error('创建失败，请稍后再试！')
            reject()
          }
        }
      })
    })
  }
  refreshCollections() {
    let { dispatch, authorId } = this.props
    dispatch({
      type: 'collection/getAll',
      payload: {
        userId: authorId
      }
    })
  }
  toggleOpenState(e) {
    let { dispatch, authorId } = this.props
    let { openState, favoriteDir } = e.currentTarget.dataset
    if (openState === 'true') {
      dispatch({
        type: 'collection/closeCollectionItem',
        payload: { favoriteDir }
      })
    } else {
      dispatch({
        type: 'collection/getCollectionPosts',
        payload: {
          userId: authorId,
          favoriteDir,
          page: 1,
          number: 5
        }
      })
    }
  }
  updateCurrentPage(favoriteDir, page) {
    let { dispatch, authorId } = this.props

    dispatch({
      type: 'collection/getCollectionPosts',
      payload: {
        userId: authorId,
        favoriteDir,
        page,
        number: 5
      }
    })
  }
  setDeleteAfterClear(deleteAfterClear) {
    return e => this.setState({
      deleteAfterClear: (deleteAfterClear !== undefined) ?
        deleteAfterClear : e.target.value
    })
  }
  clearCollection(favoriteDir, hasPost) {
    return () => {
      let { dispatch, authorId } = this.props
      let payload = {
        authorId,
        favoriteDir,
        successCallback: () => {
          this.refreshCollections()
        }
      }
      if (!!hasPost) {
        // 收藏夹有帖子则需要考虑是只清空，还是直接删除
        let { deleteAfterClear } = this.state
        if (deleteAfterClear) {
          // 清空并删除，则直接删除
          payload.toDelete = true
        } else {
          // 只清空，不需要修改payload
        }
      } else {
        // 直接删除
        payload.toDelete = true
      }
      dispatch({
        type: 'collection/clearCollection',
        payload
      })
    }
  }
  render () {
    let { collections, guest, loadingAll } = this.props
    let iconStyle = { fontSize: 60, color: '#999' }
    let { newCollectionName, deleteAfterClear } = this.state

    return (
      <div className={styles.listWithHeader}>
        <header className={styles.header}>
          <h4>收藏夹({collections.length})</h4>
          {guest ? null : (
            <Confirm
              triggerModalBtn={
                <Button icon="plus">新建收藏夹</Button>
              }
              modalTitle="新建收藏夹"
              confirmBtnText="创建"
              handleOk={this.createCollection}
            >
              <p>
                <span className={styles.colorRed}>*</span>
                请填写收藏夹名称：
              </p>
              <div className="inputWrapper">
                <Input
                  className={styles.input}
                  placeholder="请填写收藏夹名称"
                  size="large"
                  value={newCollectionName}
                  onChange={this.onNewCollectionNameChange}
                  onPressEnter={this.createCollection} />
              </div>
            </Confirm>
          )}
        </header>
        {
          loadingAll ? (
            <div className={styles.spinWrapper}><Spin tip="加载中..." /></div>
          ) : (
            <main className={styles.main}>
              {
                collections.length ? (
                  <div className={styles.collectionWrapper}>
                    {
                      collections.map(item => (
                        <div
                          key={item.favoriteDir}
                          className={!!item.open ? styles.openCollectionItem : styles.collectionItem}
                        >
                          <header
                            className={styles.header}
                            data-open-state={!!item.open}
                            data-favorite-dir={item.favoriteDir}
                            onClick={this.toggleOpenState}
                          >
                            <div className={styles.caretWrapper}>
                              <Icon type={!!item.open ? 'caret-down' : 'caret-right'} />
                            </div>
                            <div className={styles.titleWrapper}>
                              <div className={styles.title}>
                                <h4>{item.favoriteDir}({item.articleNum})</h4>
                                {guest ? null : <i className={styles.editIcon}><Icon type="edit" /></i>}
                              </div>
                              {guest ? null : (
                                <Confirm
                                  triggerModalBtn={<p className={styles.delIcon}><Icon type="delete"></Icon></p>}
                                  modalTitle="提示"
                                  beforeShowModal={this.resetDeleteAfterClear}
                                  handleOk={this.clearCollection(item.favoriteDir, item.articleNum)}
                                >
                                    {item.articleNum ? (
                                      <React.Fragment>
                                        <p>确定清空"{item.favoriteDir}"收藏夹吗？</p>
                                        <footer>
                                          <Checkbox
                                            checked={deleteAfterClear}
                                            onChange={this.onDeleteAfterClearChange}
                                          >
                                            <span>清空并删除收藏夹</span>
                                          </Checkbox>
                                        </footer>
                                      </React.Fragment>
                                    ) : (
                                      <p>确定删除"{item.favoriteDir}"收藏夹吗？</p>
                                    )}

                                </Confirm>
                              )}
                            </div>
                          </header>
                          <div className={styles.postListWrapper}>
                            {
                              item.loading ? (
                                <div className={styles.spinWrapper}><Spin tip="加载中..." /></div>
                              ): (
                                item.error ? (
                                  <div className={styles.iconWrapper}>
                                    <Icon type="frown" style={iconStyle} />
                                    <p>{item.message || '加载失败，请稍后再试！'}</p>
                                  </div>
                                ): (
                                  (item.articleNum && item.posts) ? (
                                    <div className={styles.postList}>
                                      {
                                        item.posts.map(c => (
                                          <CollectionItem
                                            key={c.favoriteId} {...c}
                                            guest={guest}
                                            favoriteDir={item.favoriteDir}
                                            updateCurrentPage={
                                              () => this.updateCurrentPage(
                                                item.favoriteDir, item.currentPage)
                                            }
                                          />
                                        ))
                                      }
                                      {
                                        item.articleNum > 5 ? (
                                          <div className={styles.paginatorWrapper}>
                                            <Pagination
                                              total={item.articleNum}
                                              pageSize={5}
                                              defaultCurrent={item.currentPage}
                                              onChange={(page) => this.updateCurrentPage(
                                                item.favoriteDir, page)}
                                            />
                                          </div>
                                        ): null
                                      }
                                    </div>
                                  ) : (
                                    <div className={styles.iconWrapper}>
                                      <Icon type="inbox" style={iconStyle} />
                                      <p>空空如也~~</p>
                                    </div>
                                  )
                                )
                              )
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className={styles.iconWrapper}>
                    <Icon type="inbox" style={iconStyle} />
                    <p>{guest ? 'TA' : '你'}还没有收藏任何文章</p>
                  </div>
                )
              }
            </main>
          )
        }

      </div>
    );
  }
}

AuthorCollection.propTypes = {
  guest: PropTypes.bool
};

export default AuthorCollection;
