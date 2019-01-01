import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Icon, Dropdown, Menu, Popover } from 'antd'
import { CompactPicker } from 'react-color'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { isKeyHotkey } from 'is-hotkey'


import styles from './index.scss'
import IconFont from 'components/common/IconFont'

const initialState = {
  document: {
    nodes: [{
      object: 'block',
      type: 'paragraph',
      nodes: []
    }]
  }
}

const DEFAULT_BLOCK_TYPE = 'paragraph'

const headingTypes = [{
  blockType: DEFAULT_BLOCK_TYPE,
  children: '正文',
  headingExample: <p></p>
}, {
  blockType: 'heading-one',
  children: '标题1',
  headingExample: <h1></h1>
}, {
  blockType: 'heading-two',
  children: '标题2',
  headingExample: <h2></h2>
}, {
  blockType: 'heading-three',
  children: '标题3',
  headingExample: <h3></h3>
}, {
  blockType: 'heading-four',
  children: '标题4',
  headingExample: <h4></h4>
}, {
  blockType: 'heading-five',
  children: '标题5',
  headingExample: <h5></h5>
}]

const isEnterKey = isKeyHotkey('enter')

export default class extends Component {
  state = {
    value: Value.fromJSON(initialState)
  }
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.focus = this.focus.bind(this)
    this.onRef = this.onRef.bind(this)
  }
  onChange(state) {
    let { value } = state
    this.setState({ value })
  }
  onRef(editor) {
    this.editor = editor
  }
  focus() {
    this.editor.focus()
  }
  onKeyDown(event, editor, next) {
    if (isEnterKey(event)) {
      console.log('enter')
      editor.insertBlock(DEFAULT_BLOCK_TYPE) // 默认情况（包括当前行为标题）下，换行时插入新的p元素
    }
  }

  hasMark(markType) {
    let { value: { activeMarks } } = this.state
    return activeMarks.some(mark => mark.type === markType)
  }
  clickOnMarkButton(e, markType) {
    e.preventDefault()
    this.editor.toggleMark(markType)
  }
  renderMark(props, editor, next) {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underline':
        return <u {...attributes}>{children}</u>
      case 'del':
        return <del {...attributes}>{children}</del>
      case 'code':
        return <code {...attributes}>{children}</code>
      default:
        return next()
    }

  }
  renderMarkToolButton(markType, iconType) {
    let isActive = this.hasMark(markType)
    return (
      <div
        className={
          isActive ? styles.activeToolIcon : styles.toolIcon}
        onClick={e => this.clickOnMarkButton(e, markType)}
      >
        <Icon type={iconType} />
      </div>
    )
  }
  renderHeadingToolButton(headingNum, selectedHeadingType) {
    let { blockType, headingExample, children } = headingTypes[headingNum]

    return (
      <div
        className={styles.headingExample}
        onClick={e => this.clickOnHeadingButton(e, blockType, headingNum)}
      >
        {React.cloneElement(headingExample, {
          className: selectedHeadingType === blockType ?
            styles.selectedHeading : styles.headingText,
          children
        })}
      </div>
    )
  }
  clickOnHeadingButton(e, blockType, headingNum) {
    e.preventDefault()

    const { editor } = this

    editor.setBlocks(blockType)
  }
  getSelectedHeading() {
    let headings = headingTypes.slice(1)
    for (let h of headings) {
      if (this.hasBlock(h.blockType)) return h
    }
    return headingTypes[0]
  }
  hasBlock(blockType) {
    let { value: { blocks } } = this.state
    return blocks.some(block => block.type === blockType)
  }
  renderNode(props, editor, next) {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'blockquote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'heading-three':
        return <h3 {...attributes}>{children}</h3>
      case 'heading-four':
        return <h4 {...attributes}>{children}</h4>
      case 'heading-five':
        return <h5 {...attributes}>{children}</h5>
      default:
        return next()
    }
  }
  render() {
    let { value } = this.state
    let selectedHeading = this.getSelectedHeading()
    let headingChoiceText = selectedHeading.children
    let selectedHeadingType = selectedHeading.blockType

    return (
      <React.Fragment>
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolbar}>
            <div className={styles.toolIconGroup}>
              <Dropdown overlay={
                <Menu>
                  {Array.apply(null, new Array(6)).map(
                    (_, i) => <Menu.Item key={i}>{this.renderHeadingToolButton(i, selectedHeadingType)}</Menu.Item>)}
                </Menu>
              }>
                <a
                  href="javascript:void(0);"
                  className={styles.selectHeadingBtn}
                >
                  <span>{headingChoiceText}</span>
                  <Icon type="down" />
                </a>
              </Dropdown>
            </div>
            <div className={styles.toolIconGroup}>
              {this.renderMarkToolButton('bold', 'bold')}
              {this.renderMarkToolButton('italic', 'italic')}
              {this.renderMarkToolButton('underline', 'underline')}
              {this.renderMarkToolButton('del', 'strikethrough')}
              <div className={styles.toolIcon}>
                <Popover
                  content={<CompactPicker />}
                  title="Title"
                  trigger="click"
                // visible={this.state.visible}
                // onVisibleChange={this.handleVisibleChange}
                >
                  <div className={styles.colorSelectTool}>
                    <Icon type="font-colors" />
                    <span className={styles.arrowIcon}>
                      <Icon type="caret-down" style={{ fontSize: 12 }} />
                    </span>
                  </div>
                </Popover>
              </div>
              <div className={styles.toolIcon}>
                <Popover
                  content={<CompactPicker />}
                  title="Title"
                  trigger="click"
                // visible={this.state.visible}
                // onVisibleChange={this.handleVisibleChange}
                >
                  <div className={styles.colorSelectTool}>
                    <Icon type="bg-colors" />
                    <span className={styles.arrowIcon}>
                      <Icon type="caret-down" style={{ fontSize: 12 }} />
                    </span>
                  </div>
                </Popover>
              </div>
            </div>
            <div className={styles.toolIconGroup}>
              <div className={styles.toolIcon}>
                <Icon type="ordered-list" />
              </div>
              <div className={styles.toolIcon}>
                <Icon type="bars" />
              </div>
            </div>
            <div className={styles.toolIconGroup}>
              <div className={styles.toolIcon}>
                <Icon type="link" />
              </div>
              <div className={styles.toolIcon}>
                <Icon type="picture" />
              </div>
              <div className={styles.toolIcon}>
                <Icon type="code" />
              </div>
              <div className={styles.toolIcon}>
                <IconFont type="icon-reference" />
              </div>
            </div>
          </div>
        </div>
        <main className={styles.main}>
          <Row>
            <Col span={18} offset={3}>
              <div className={styles.editorWrapper}>
                <div className={styles.titleInputWrapper}>
                  <input type="text" placeholder="请输入标题..." />
                </div>
                <div className={styles.mainContentWrapper} onClick={this.focus}>
                  <Editor
                    ref={this.onRef} value={value}
                    onChange={this.onChange}
                    renderMark={this.renderMark}
                    renderNode={this.renderNode}
                    onKeyDown={this.onKeyDown}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </main>
      </React.Fragment>
    )
  }
}