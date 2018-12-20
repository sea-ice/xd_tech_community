import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Button, Checkbox, Input, Icon, message } from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import IconBtn from 'components/common/IconBtn'

@connect(state => ({
  collections: state.collection.all,
  tempCollection: state.collection.temp,
  selectedIdx: state.collection.selectedTargetWhenSavePost
}))
class CollectionPanel extends Component {
  constructor(props) {
    super(props)
    this.getCollections = this.getCollections.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.addNewCollection = this.addNewCollection.bind(this)
    this.collectPost = this.collectPost.bind(this)
    this.inputCollectionName = this.inputCollectionName.bind(this)
    this.deleteInput = this.deleteInput.bind(this)
    this.createCollection = this.createCollection.bind(this)
    this.collectionNameInput = React.createRef()
  }
  componentDidMount() {
    this.resetTempCollection() // 清空temp
  }
  getCollections() {
    let { dispatch, userId } = this.props
    dispatch({
      type: 'collection/getAll',
      payload: { userId }
    })
  }
  selectItem(e) {
    let { dispatch, selectedIdx } = this.props
    let clickItemIdx = Number(e.currentTarget.dataset.itemIdx)
    if (selectedIdx !== clickItemIdx) {
      dispatch({
        type: 'collection/setState',
        payload: {
          selectedTargetWhenSavePost: clickItemIdx
        }
      })
    }
  }
  collectPost() {
    return new Promise((resolve, reject) => {
      let { dispatch, selectedIdx, collections, tempCollection } = this.props
      let gatherCollections = collections.concat(tempCollection)
      if (selectedIdx === null) {
        message.error(
          gatherCollections.length ?
            '请选择一个文件夹然后再保存' : '请先新建一个文件夹')
        return resolve()
      }

      let collectionName = gatherCollections[selectedIdx].favoriteDir.trim()
      let saveSuccessCallback = () => {
        message.success('保存成功！')
        // 收藏成功之后需要将帖子详情中的收藏状态更新
        dispatch({
          type: 'postDetails/setInfo',
          payload: {
            key: 'postInfo',
            newInfo: {
              collected: true
            }
          }
        })
        resolve(true) // 隐藏对话框
      }
      let saveFailCallback = () => {
        message.error('保存失败！')
        reject()
      }
      if (selectedIdx === collections.length) {
        // 选中当前正在编辑的收藏夹，需要先新建该收藏夹再保存
        this.createCollection(() => {
          this.savePostToCollection(
            collectionName, saveSuccessCallback, saveFailCallback)
        })
      } else {
        this.savePostToCollection(
          collectionName, saveSuccessCallback, saveFailCallback)
      }
    })
  }
  savePostToCollection(collectionName, successCallback, failCallback) {
    let { dispatch, userId, postId } = this.props
    dispatch({
      type: 'userBehaviors/collectPost',
      payload: {
        userId,
        postId,
        favoriteDir: collectionName,
        successCallback,
        failCallback
      }
    })
  }

  addNewCollection() {
    let { collections, tempCollection } = this.props
    if (tempCollection.length) {
      // 检查未保存的收藏夹名称是否冲突
      let tempCollectionName = tempCollection[0].favoriteDir.trim()
      if (!tempCollectionName) {
        // 正在编辑的名称为空的收藏夹
        this.collectionNameInput.current.focus() // 输入框获取焦点
        this.selectTempCollection()
        return
      }
      let hasConflict = collections.find(
        item => item.favoriteDir === tempCollectionName)
      if (hasConflict) {
        return message.error('收藏夹名称存在冲突！')
      } else {
        // 保存正在编辑的收藏夹，然后再新建收藏夹
        this.createCollection(() => this.addInput())
      }
    } else {
      this.addInput()
    }
  }

  inputCollectionName(e) {
    let { dispatch } = this.props
    let val = e.target.value
    dispatch({
      type: 'collection/setItem',
      payload: {
        key: 'temp',
        items: { 0: { favoriteDir: val } }
      }
    })
  }
  addInput() {
    let { dispatch } = this.props
    dispatch({
      type: 'collection/setState',
      payload: {
        temp: [{ favoriteDir: '' }]
      }
    })
    this.selectTempCollection()
  }
  resetTempCollection() {
    let { dispatch } = this.props
    dispatch({
      type: 'collection/setState',
      payload: { temp: [] }
    })
  }
  deleteInput(e) {
    this.resetTempCollection()
    let { dispatch, selectedIdx, collections } = this.props
    if (selectedIdx === collections.length) {
      // 如果当前选中的是正在编辑的收藏夹，则将选中的idx置为null
      dispatch({
        type: 'collection/setState',
        payload: { selectedTargetWhenSavePost: null }
      })
    }
    e.stopPropagation() // 阻止事件冒泡进而触发item的点击事件
  }
  selectTempCollection() {
    let { dispatch, selectedIdx, collections } = this.props
    if (selectedIdx !== collections.length) {
      dispatch({
        type: 'collection/setState',
        payload: { selectedTargetWhenSavePost: collections.length }
      })
    }
  }
  createCollection(successCallback) {
    let { dispatch, userId, tempCollection, collections } = this.props
    let collectionName = tempCollection[0].favoriteDir.trim()
    // todo: 检查输入的收藏夹名称合法性
    if (!collectionName) {
      return message.error('收藏夹名称不允许为空！')
    }
    let hasConflict = collections.find(
      item => item.favoriteDir === collectionName)
    if (hasConflict) {
      return message.error('收藏夹名称存在冲突！')
    }
    successCallback = successCallback || (() => {})
    dispatch({
      type: 'collection/new',
      payload: {
        userId,
        collectionName,
        successCallback
      }
    })
  }
  render() {
    let { btn, collections = [], selectedIdx, tempCollection } = this.props
    return (
      <Confirm
        triggerModalBtn={btn}
        modalTitle="选择收藏夹"
        confirmBtnText="保存"
        handleOk={this.collectPost}
        beforeShowModal={this.getCollections}
      >
        <header className={styles.header}>
          <Button icon="plus" onClick={this.addNewCollection}>新建收藏夹</Button>
        </header>
        <main className={styles.main}>
          {
            (collections.length || tempCollection.length) ? (
              <ul className={styles.list}>
                {
                  collections.map((item, i) => (
                    <li
                      className={i === selectedIdx ? styles.selectedItem : styles.item}
                      key={item.favoriteDir}
                      data-item-idx={i}
                      onClick={this.selectItem}
                    >
                      <Checkbox checked={i === selectedIdx}>
                        {item.favoriteDir}({item.articleNum})
                      </Checkbox>
                    </li>
                  ))
                }
                {
                  tempCollection.length ? (
                    <li
                      className={
                        collections.length === selectedIdx ?
                        styles.selectedEditItem : styles.editItem}
                      data-item-idx={collections.length}
                      onClick={this.selectItem}
                    >
                      <div className={styles.inputContainer}>
                        <Checkbox
                          checked={collections.length === selectedIdx}
                        ></Checkbox>
                        <div className={styles.inputWrapper}>
                          <Input
                            ref={this.collectionNameInput}
                            onChange={this.inputCollectionName}
                            onPressEnter={this.createCollection}
                          />
                        </div>
                        <p className={styles.inputTips}>按回车保存</p>
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={styles.delete}
                        onClick={this.deleteInput}
                      ><Icon type="close" /></a>
                    </li>
                  ) : null
                }
              </ul>
            ) : (
              <div className={styles.none}>
                <IconBtn
                  type="icon"
                  iconType="inbox"
                  iconBtnStyle={{justifyContent: 'center', cursor: 'auto'}}
                  iconSize={36}
                  color="#999"
                  fontSize={18}
                  iconBtnText="暂无收藏夹"
                />
              </div>
            )
          }
        </main>
      </Confirm>
    );
  }
}

CollectionPanel.propTypes = {
  btn: PropTypes.element,
  userId: PropTypes.number,
  postId: PropTypes.number
};

export default CollectionPanel;
