import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Spin } from 'antd'

import styles from './index.scss'

class PullupLoadMore extends Component {
  state = {
    loading: false,
    error: false,
    noMoreData: false
  }
  constructor (props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    this.reloadPage = this.reloadPage.bind(this)
    this.page = props.initPageNum || 2 // 第一次上拉加载的page number
    this.initScroll = false
  }
  initScrollEvent() {
    let { scrollListener } = this.props
    if (scrollListener) {
      scrollListener.addEventListener('scroll', this.handleScroll)
      this.initScroll = true
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { scrollListener } = nextProps
    if (!this.initScroll && scrollListener) {
      scrollListener.addEventListener('scroll', this.handleScroll)
      this.initScroll = true
    }
  }
  handleScroll(e) {
    let { loading, noMoreData } = this.state
    if (loading || noMoreData) return

    let root = e.target
    let { container, threshold = 90, loadCondition = () => true } = this.props
    if (!container) return

    let appMainHeight = container.clientHeight
    if (
      (root.scrollTop > appMainHeight - root.clientHeight - threshold) &&
      loadCondition()
    ) {
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
    if (this.props.onRef) this.props.onRef(this)
    this.initScrollEvent()
  }
  componentWillUnmount() {
    let { scrollListener } = this.props
    if (scrollListener) {
      scrollListener.removeEventListener('scroll', this.handleScroll)
    }
  }
  render () {
    let { children } = this.props
    let { loading, error, noMoreData } = this.state
    return (
      <div>
        {children}
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

export default PullupLoadMore;
