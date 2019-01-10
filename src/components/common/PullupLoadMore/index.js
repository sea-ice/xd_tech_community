import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Spin } from 'antd'

import styles from './index.scss'

class PullupLoadMore extends Component {
  state = {
    firstLoading: true,
    loading: false,
    error: false,
    noMoreData: false
  }
  constructor (props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    this.reloadPage = this.reloadPage.bind(this)
    this.page = props.initPageNum || 2 // 第一次上拉加载的page number
    this.initScrollEvent()
  }
  initScrollEvent() {
    document.getElementById('root').addEventListener(
      'scroll', this.handleScroll)
  }
  handleScroll(e) {
    let root = e.target
    let appMainHeight = document.getElementById('app-main').clientHeight
    console.log(root.scrollTop)
    console.log(`threshold: ${appMainHeight - root.clientHeight - 50}`)
    if (root.scrollTop > appMainHeight - root.clientHeight - 50) {
      let { firstLoading } = this.state
      if (firstLoading) this.setState({firstLoading: false})
      this.getPageData()
    }
  }
  getPageData() {
    let { loading, error, noMoreData } = this.state
    if (loading || error || noMoreData) return
    this.setState({ loading: true })
    let { getPageData } = this.props
    getPageData(this.page).then(res => {
      this.setState({ loading: false })

      if (res.noMoreData) {
        this.setState({ noMoreData: true })
      } else {
        this.page++
      }
    }).catch(() => {
      this.setState({
        loading: false,
        error: true
      })
    })
  }
  reloadPage() {
    this.setState({ error: null }, () => {
      this.getPageData()
    })
  }
  resetState() {
    let { initPageNum } = this.props
    this.page = initPageNum || 2
    this.setState({
      loading: false,
      error: false,
      noMoreData: false
    })
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    document.getElementById('root').removeEventListener(
      'scroll', this.handleScroll)
  }
  render () {
    let { children } = this.props
    let { firstLoading, loading, error, noMoreData } = this.state
    return (
      <div>
        {children}
        {/* 此处的firstLoading是障眼法，模拟页面初始加载时的loading */}
        {firstLoading ? (<div className={styles.spinWrapper}><Spin tip="加载中..." /></div>) : null}
        {loading ? (
          <div className={styles.spinWrapper}><Spin tip="加载中..." /></div>
        ) : (
          error ? (
            <p className={styles.tips}>
              加载失败，请<a href="javascript:void(0);" onClick={this.reloadPage}>点此刷新</a>重试！
            </p>
          ): null
        )}
        {
          noMoreData ? (
            <p className={styles.tips}>没有更多数据了！</p>
          ) : null
        }
      </div>
    );
  }
}

PullupLoadMore.propTypes = {
  initPageNum: PropTypes.number,
  getPageData: PropTypes.func, // 返回Promise对象，PullupLoadMore组件调用此函数时会传入当前page
};

export default connect()(PullupLoadMore);
