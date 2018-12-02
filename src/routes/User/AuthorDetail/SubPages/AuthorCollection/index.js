import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Button, Tree, Icon, notification} from 'antd'
import {List} from 'immutable'

import styles from './index.scss'
import PostItem from 'AuthorDetail/PostItem'

class AuthorCollection extends Component {
  constructor (props) {
    super(props)
    this.handleNodeDrop = this.handleNodeDrop.bind(this)
    this.state = {
      collection: List([{
        id: 1,
        name: 'JavaScript',
        posts: [{
          title: 'JavaScriptff语法',
          view: 2254,
          like: 1120,
          comment: 899
        }, {
          title: 'JavaScript语法',
          view: 2254,
          like: 1120,
          comment: 899
        }]
      }, {
        id: 2,
        name: 'HTML',
        posts: [{
          title: 'HTML5',
          view: 2254,
          like: 1120,
          comment: 899
        }, {
          title: 'HTML&&CSS',
          view: 2254,
          like: 1120,
          comment: 899
        }]
      }, {
        id: 3,
        name: 'CSS',
        posts: []
      }])
    }
  }
  warning (description) {
    notification.warn({
      message: 'Warning',
      description
    })
  }
  handleNodeDrop (info) {
    // console.log('drop')
    // console.log(info)
    let {node, dragNode, dropPosition} = info
    dragNode = dragNode.props.pos.split('-')
    let targetNode = node.props.pos.split('-')
    let dropToGapTop = dropPosition - Number(targetNode[targetNode.length - 1]) === -1

    if (dragNode.length === 2) {
      return this.warning('无法移动收藏夹')
    } else if (targetNode.length === 2 && dropToGapTop) {
      return this.warning('帖子只能移动到收藏夹内')
    } else if (dragNode[1] === targetNode[1]) {
      return this.warning('帖子不能移动到同一个收藏夹')
    }
    let {collection} = this.state
    collection = List(collection)
    let removed = collection.get(dragNode[1]).posts.splice(dragNode[2], 1)// 普通的数组
    if (targetNode.length === 2) {
      // 移动到根节点底部或者是根节点上
      collection.get(targetNode[1]).posts.unshift(removed[0])
    } else {
      collection.get(targetNode[1]).posts.splice(dropPosition, 0, removed[0])
    }
    this.setState({collection})
  }
  render () {
    let {collection} = this.state
    return (
      <div className={styles.listWithHeader}>
        <header className={styles.header}>
          <h4>收藏夹(4)</h4>
          <Button icon="plus">新建收藏夹</Button>
        </header>
        <div className={styles.collectionWrapper}>
          <Tree
            defaultExpandedKeys={[collection.get(0).name]}
            onDrop={this.handleNodeDrop} draggable>
            {
              collection.map(folder => (
                <Tree.TreeNode key={folder.name} title={
                  <header className={styles.rootNode}>
                    <h4>{folder.name}</h4>
                    <p className={styles.delIcon}><Icon type="delete"></Icon></p>
                  </header>
                }>
                  {
                    folder.posts.map(post => (
                      <Tree.TreeNode key={post.title} title={
                        <PostItem {...post} />
                      } isLeaf></Tree.TreeNode>
                    ))
                  }
                </Tree.TreeNode>
              ))
            }
          </Tree>
        </div>
      </div>
    );
  }
}

AuthorCollection.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorCollection);
