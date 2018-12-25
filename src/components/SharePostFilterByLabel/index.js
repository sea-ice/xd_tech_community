import React, {Component} from 'react'
import {createSelector} from 'reselect'
import {Tag, Button} from 'antd'
import {connect} from 'dva'

import styles from './index.scss'
import categories from 'config/categoryTags.json'
import {hasSameElements} from 'utils'

const currentCategoryTagsSelector = createSelector(
  state => state.postFilterState.activeCategory,
  activeCategory => categories.find(
    c => c.name === activeCategory).tags.map(t => t.name)
)

@connect(state => ({
  userInfo: state.user.userInfo,
  collapse: state.postFilterState.collapse,
  activeCategory: state.postFilterState.activeCategory,
  currentCategoryTags: currentCategoryTagsSelector(state), // 当前所选大类下的所有二级标签列表
  selectedTags: state.postFilterState.selectedTags,
  confirmState: state.postFilterState.confirmState,
  confirmedTags: state.postFilterState.confirmedTags
}))
class SharePostFilterByLabel extends Component {
  constructor (props) {
    super(props)
    this.selectTagLimit = 10
    this.changeCategory = this.changeCategory.bind(this)
    this.selectTag = this.selectTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.getFilterPost = this.getFilterPost.bind(this)
    this.resetSelectTags = this.resetSelectTags.bind(this)
    this.setConfirmState = this.setConfirmState.bind(this)
  }
  changeCategory (e) {
    let {dispatch, activeCategory} = this.props
    let newCategory = e.target.innerText.trim()
    if (activeCategory !== newCategory) {
      dispatch({
        type: 'postFilterState/setState',
        payload: {activeCategory: newCategory}
      })
    }
  }
  selectTag (e) {
    let selectType = e.target.dataset.selectType
    let selected = [].some.call(
      e.target.parentNode.classList, c => ~c.indexOf('Active'))
    let removedItems = []
    let addItems = []
    let {
      dispatch,
      selectedTags,
      currentCategoryTags
    } = this.props
    if (selectType && selectType === '__ALL__') {
      // 点击全部
      if (selected) {
        removedItems.splice(0, 0, ...currentCategoryTags)
      } else {
        // 添加当前未被选中的二级标签
        addItems.splice(0, 0, ...currentCategoryTags.filter(
          tag => !selectedTags.find(t => t === tag)
        ))
      }
    } else {
      let tagName = e.target.innerText.trim()
      if (selected) {
        removedItems.push(selectedTags.find(tag => tag === tagName))
      } else {
        addItems.push(currentCategoryTags.find(tag => tag === tagName))
      }
    }
    dispatch({
      type: 'postFilterState/changeOneTag',
      payload: {
        selectedTags: removedItems.length ? selectedTags.filter(
          tag => !removedItems.find(t => tag === t)
        ) : selectedTags.concat(
          addItems.slice(0, this.selectTagLimit - selectedTags.length)
        )
      }
    })
  }
  deleteTag (tagName) {
    return () => {
      let {dispatch, selectedTags} = this.props
      dispatch({
        type: 'postFilterState/changeOneTag',
        payload: {
          selectedTags: selectedTags.filter(tag => tag !== tagName)
        }
      })
    }
  }
  getFilterPost () {
    // 检查selectedTags和confirmedTags是否一致
    let { selectedTags, confirmedTags, dispatch, userInfo, resetPullup } = this.props
    if (hasSameElements(selectedTags, confirmedTags)) {
      this.setConfirmState('confirmed')
      return
    }

    dispatch({
      type: 'recommendPosts/getPostByNewTags',
      payload: {
        userInfo,
        tags: selectedTags,
        successCallback() {
          resetPullup()
        }
      }
    })
  }
  resetSelectTags () {
    let { selectedTags, confirmedTags, userInfo, dispatch, resetPullup } = this.props
    if (!confirmedTags.length) {
      if (selectedTags.length) {
        dispatch({
          type: 'postFilterState/setState',
          payload: {
            selectedTags: [],
            confirmState: 'confirmed'
          }
        })
      }
      return
    }
    dispatch({
      type: 'recommendPosts/getPostByNewTags',
      payload: {
        userInfo,
        tags: [],
        successCallback() {
          resetPullup()
        }
      }
    })
  }
  setConfirmState (confirmState) {
    let {dispatch} = this.props
    dispatch({
      type: 'postFilterState/setState',
      payload: {confirmState}
    })
  }
  render () {
    let {
      collapse,
      activeCategory,
      currentCategoryTags,
      selectedTags,
      confirmState
    } = this.props
    return (
      <div className={styles.labelFilter}>
        <div className={ collapse ? styles.collapse : styles.open}>
          <ul className={styles.categories}>
            {categories.map(c => (
              <li key={c.name}>
                <a href="javascript:void(0);"
                  className={activeCategory === c.name ? styles.categoryLinkActive : styles.categoryLink}
                  onClick={this.changeCategory}
                >{c.name}</a>
              </li>))}
          </ul>
          <div className={styles.categoryTags}>
            <ul className={styles.categoryTagsList}>
              <li className={
                currentCategoryTags.every(
                  tag => !!(selectedTags.find(t => t === tag))
                ) ? styles.categoryTagActive : styles.categoryTag
              }>
                <a
                  href="javascript:void(0);"
                  onClick={this.selectTag}
                  data-select-type="__ALL__"
                >全部</a>
              </li>

              {
                currentCategoryTags.map(
                tag => <li key={tag} className={!!(selectedTags.find(t => t === tag)) ? styles.categoryTagActive : styles.categoryTag}>
                  <a
                    href="javascript:void(0);"
                    onClick={this.selectTag}>{tag}</a>
                </li>)
              }
            </ul>
          </div>
        </div>
        <div className={styles.selectTags}>
          <div className={styles.selectTagsMain}>
            <span className={styles.selectTagsTitle}>已选标签({selectedTags.length}/{this.selectTagLimit})：</span>
            {
              selectedTags.length ? selectedTags.map(tag => <div className={styles.selectTag} key={tag}>
                <Tag closable={true} onClose={this.deleteTag(tag)}>{tag}</Tag>
              </div>) :
              <span className={styles.selectTagTips}>（最多可选{this.selectTagLimit}个）</span>
            }
          </div>
          {
            !!selectedTags.length &&
            <div className={styles.selectTagFooter}>
              <Button
                type="primary"
                size="small"
                disabled={confirmState !== 'waitConfirm'}
                loading={confirmState === 'loading'}
                onClick={this.getFilterPost}>{
                  confirmState !== 'waitConfirm' ? confirmState === 'loading' ? '加载中' : '已刷新' : '确认'
                }</Button>
              <div className={styles.space_02rem}></div>
              <Button size="small" onClick={this.resetSelectTags}>重置</Button>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default SharePostFilterByLabel
