import React, {Component} from 'react'
import {Tag, Button} from 'antd'

import styles from './index.scss'
import categories from 'config/categoryTags.json'

class PostFilterByLabel extends Component {
  constructor (props) {
    super(props)
    this.selectTagLimit = 10
    this.changeCategory = this.changeCategory.bind(this)
    this.selectTag = this.selectTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.getFilterPost = this.getFilterPost.bind(this)
    this.state = {
      categories,
      activeCategory: categories[0].name,
      currentCategoryTags: categories[0].tags, // 当前所选大类下的所有二级标签列表
      selectedTags: []
    }
    setTimeout(() => {
      let hotTags = [{
        name: 'Java'
      }, {
        name: 'JavaScript'
      }]
      this.setState({
        categories: [{
          name: '热门标签',
          tags: hotTags
        }].concat(categories),
        activeCategory: '热门标签',
        currentCategoryTags: hotTags
      })
    }, 5000)
  }
  changeCategory (e) {
    let newCategory = e.target.innerText.trim()
    let {categories} = this.state
    if (this.state.activeCategory !== newCategory) {
      this.setState({
        activeCategory: newCategory,
        currentCategoryTags: categories.find(c => c.name === newCategory).tags
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
      selectedTags,
      currentCategoryTags
    } = this.state
    if (selectType && selectType === '__ALL__') {
      // 点击全部
      if (selected) {
        removedItems.splice(0, 0, ...currentCategoryTags)
      } else {
        // 添加当前未被选中的二级标签
        addItems.splice(0, 0, ...currentCategoryTags.filter(
          tag => !selectedTags.find(t => t.name === tag.name)
        ))
      }
    } else {
      let tagName = e.target.innerText.trim()
      if (selected) {
        removedItems.push(selectedTags.find(tag => tag.name === tagName))
      } else {
        addItems.push(currentCategoryTags.find(tag => tag.name === tagName))
      }
    }
    this.setState({
      confirmState: 'waitSubmit',
      selectedTags: removedItems.length ? selectedTags.filter(
        tag => !removedItems.find(t => tag.name === t.name)
      ) : selectedTags.concat(
        addItems.slice(0, this.selectTagLimit - selectedTags.length)
      )
    })
  }
  deleteTag (tagName) {
    return () => {
      let {selectedTags} = this.state
      this.setState({
        confirmState: 'waitSubmit',
        selectedTags: selectedTags.filter(tag => tag.name !== tagName)
      })
    }
  }
  getFilterPost () {
    this.changeConfirmState('loading')
    this.props.refreshOnTagChange(this.selectedTags).then(() => {
      this.changeConfirmState('done')
    })
  }
  changeConfirmState (confirmState) {
    this.setState({confirmState})
  }
  render () {
    let {collapse} = this.props
    let {
      categories,
      activeCategory,
      currentCategoryTags,
      selectedTags,
      confirmState
    } = this.state
    return (
      <div className={styles.labelFilter}>
        <div className={ collapse ? styles.collapse : styles.open}>
          <ul className={styles.categories}>
            {categories.map(c => (
              <li key={c.name} key={c.name}>
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
                  tag => !!(selectedTags.find(t => t.name === tag.name))
                ) ? styles.categoryTagActive : styles.categoryTag
              }>
                <a
                  href="javascript:void(0);"
                  onClick={this.selectTag}
                  data-select-type="__ALL__"
                >全部</a>
              </li>

              {currentCategoryTags.map(
                tag => <li key={tag.name} className={!!(selectedTags.find(t => t.name === tag.name)) ? styles.categoryTagActive : styles.categoryTag}>
                  <a
                    href="javascript:void(0);"
                    onClick={this.selectTag}>{tag.name}</a>
                </li>)}
            </ul>
          </div>
        </div>
        <div className={styles.selectTags}>
          <div className={styles.selectTagsMain}>
            <span className={styles.selectTagsTitle}>已选标签({selectedTags.length}/{this.selectTagLimit})：</span>
            {
              selectedTags.length ? selectedTags.map(tag => <div className={styles.selectTag} key={tag.name}>
                <Tag closable={true} onClose={this.deleteTag(tag.name)}>{tag.name}</Tag>
              </div>) :
              <span className={styles.selectTagTips}>（最多可选{this.selectTagLimit}个）</span>}
          </div>
          {
            !!selectedTags.length &&
            <div className={styles.selectTagFooter}>
              <Button
                type="primary"
                size="small"
                disabled={confirmState !== 'waitSubmit'}
                loading={confirmState === 'loading'}
                onClick={this.getFilterPost}>确认</Button>
              <div className={styles.space_02rem}></div>
              <Button size="small">重置</Button>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default PostFilterByLabel
