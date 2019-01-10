import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { fromJS, List } from 'immutable'
import { connect } from 'dva';
import { Row, Col } from 'antd'

import styles from './index.scss'
import categories from 'config/categoryTags.json'
import { hasSameElements, getDiffElements } from 'utils'

class LabelSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTags: List([]),
      categoryList: fromJS(categories)
    }
    this.selectTag = this.selectTag.bind(this)
  }

  componentDidMount() {
    let selectedTags = this.props.selectedTags || []
    this.toggleMultiTagState(selectedTags) // 初始化selectedTags和categoryList
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let { selectedTags } = this.state
    selectedTags = selectedTags.toJS()
    if (!hasSameElements(selectedTags, nextProps.selectedTags)) {
      let differentTags = getDiffElements(selectedTags, nextProps.selectedTags)
      this.toggleMultiTagState(differentTags)
    }
  }

  toggleMultiTagState(tag, notifySelectedTags) {
    let { selectedTags, categoryList } = this.state
    if (Object.prototype.toString.call(tag) === '[object Array]') {
      for (let t of tag) {
        ;({ selectedTags, categoryList } = this.toggleOneTagState(t, selectedTags, categoryList))
      }
    } else {
      ;({ selectedTags, categoryList } = this.toggleOneTagState(tag))
    }
    this.setState({
      selectedTags,
      categoryList
    }, () => {
      let { selectedTags } = this.state
      if (notifySelectedTags) notifySelectedTags(selectedTags.toJS())
    })
  }

  toggleOneTagState(t, selectedTags, categoryList) {
    if (selectedTags === undefined && categoryList === undefined) {
      ;({ selectedTags, categoryList } = this.state)
    }
    let updateSelectedTags = false
    for (let i = 0, len = categoryList.size; i < len; i++) {
      let tags = categoryList.get(i).get('tags')
      let tagIdx = tags.findIndex(tag => tag.get('name') === t)
      if (~tagIdx) {
        categoryList = categoryList.updateIn([i, 'tags', tagIdx, 'selected'], val => !val)
        if (!updateSelectedTags) {
          // 更新selectedTags
          if (!!tags.getIn([tagIdx, 'selected'])) {
            let tagIdx = selectedTags.indexOf(t)
            console.log('remove item')
            console.log(tagIdx)
            selectedTags = selectedTags.remove(tagIdx)
            console.log(selectedTags)
          } else {
            selectedTags = selectedTags.push(t)
          }
          updateSelectedTags = true
        }
      }
    }
    return { selectedTags, categoryList }
  }

  selectTag(e) {
    this.toggleMultiTagState(e.target.innerText, tags => {
      this.props.notifySelectedTags(tags)
    })
  }


  render() {
    let { categoryList } = this.state
    return (
      <div className={styles.categoryWrapper}>
        {
          categoryList.size ? (
            categoryList.map((category, i) => (
              <div key={i} className={styles.category}>
                <h4>{category.get('name')}</h4>
                <ul className={styles.categoryTagsList}>
                  {
                    category.get('tags').map(tag => (
                      <li
                        key={tag.get('name')}
                        className={!!tag.get('selected') ? styles.categoryTagActive : styles.categoryTag}>
                        <a
                          href="javascript:void(0);"
                          onClick={this.selectTag}>{tag.get('name')}</a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          ) : null
        }
      </div>
    );
  }
}

LabelSelector.propTypes = {
  notifySelectedTags: PropTypes.func
};

export default connect()(LabelSelector);
