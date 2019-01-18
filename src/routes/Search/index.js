import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Row, Col, Icon, message } from 'antd'
import { checkLogin, getSearchObj } from 'utils'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import PullupLoadMore from 'components/common/PullupLoadMore'
import PlainPostItem from 'components/Post/PlainPostItem'

@connect(state => ({
  userId: state.user.userId,
  searchResults: state.searchPost.searchResults,
  searchKeyword: state.searchPost.searchKeyword
}))
@withRouter
@checkLogin({
  *checkLoginFinish(userInfo, { put }, props) {
    let { location } = props
    let { q } = getSearchObj(location)
    yield put({
      type: 'searchPost/getPageData',
      payload: {
        page: 0,
        number: 10,
        userId: !!userInfo ? userInfo.userId : 0,
        keyword: window.decodeURIComponent(q.trim()),
        reset: true
      }
    })
  }
})
class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.getSearchPageData = this.getPageData.bind(this)()
    this.appMain = React.createRef()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 用户在当前页输入不同的关键字进行搜索
    let { searchKeyword } = this.props
    let newKeyword = nextProps.searchKeyword

    if (!!searchKeyword && (newKeyword !== searchKeyword)) {
      let hideLoading = message.loading('加载中...')
      this.getSearchResultByNewKeyword(newKeyword, () => {
        hideLoading()
        if (this.pullup) this.pullup.resetState()
        message.success('加载成功！')
      }, () => {
        hideLoading()
        message.success('加载失败！')
      })
    }
  }

  getSearchResultByNewKeyword(keyword, successCallback, failCallback) {
    // 根据新的关键词重新搜索结果
    let { dispatch, userId } = this.props
    dispatch({
      type: 'searchPost/getPageData',
      payload: {
        userId: userId || 0,
        page: 0,
        number: 10,
        keyword,
        reset: true,
        successCallback,
        failCallback
      }
    })
  }

  setSearchPageState(newState) {
    let { dispatch } = this.props
    dispatch({
      type: 'searchPost/setState',
      payload: newState
    })
  }

  getPageData() {
    return (page) => new Promise((resolve, reject) => {
      let { dispatch, userId, searchKeyword } = this.props
      dispatch({
        type: 'searchPost/getPageData',
        payload: {
          page,
          number: 10,
          userId: userId || 0,
          keyword: searchKeyword,
          reset: false,
          successCallback: (res) => {
            // res为响应
            let { data: { code } } = res
            let result = {}
            if (code === 216) {
              result = { noMoreData: true }
            }
            resolve(result)
          }
        }
      })
    })
  }

  render () {
    let { searchResults } = this.props

    let iconStyle = { fontSize: 60, color: '#999' }
    return (
      <div>
        <FixedHeader />
        <main className="app-main" ref={this.appMain}>
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                {
                  !!searchResults.length ? (
                    <PullupLoadMore
                      initPageNum={1}
                      container={this.appMain.current}
                      onRef={p => this.pullup = p}
                      getPageData={this.getSearchPageData}
                    >
                      <ul className={styles.postList}>
                        {
                          searchResults.map(
                            p => <PlainPostItem key={p.articleId} {...p} />)
                        }
                      </ul>
                    </PullupLoadMore>
                  ) : (
                    <div className={styles.iconWrapper}>
                      <Icon type="inbox" style={iconStyle} />
                      <p>没有相关结果</p>
                    </div>
                  )
                }
              </div>
            </Col>
          </Row>

        </main>
      </div>
    );
  }
}

SearchPage.propTypes = {
};

export default SearchPage
