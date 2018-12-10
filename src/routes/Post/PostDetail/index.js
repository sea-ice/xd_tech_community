import React, {Component} from 'react';
import { connect } from 'dva';
import {Row, Col, Affix, Button, Popover, Tag, Avatar} from 'antd'

import styles from './index.scss'
import colorfulTags from 'config/colorfulTags.json'
import {checkLogin} from 'utils'

import FixedHeader from 'components/common/FixedHeader'
import Confirm from 'components/common/Confirm'
import ReportUserForm from 'components/User/ReportUserForm'
import IconBtn from 'components/common/IconBtn'
import CommentItem from 'components/Comment/CommentItem'
import CommentBox from 'components/Comment/CommentBox'

@checkLogin
@connect()
class PostDetail extends Component {
  state = {
    tags: ['JavaScript', 'HTML']
  };

  constructor (props) {
    super(props)
    let {match} = props
    console.log(match)
    this.reportAuthorTemplate = <ul className="no-margin">
      <li>
        <Confirm
          triggerModalBtn={
            <a href="javascript:void(0);" className={styles.popoverItem}>举报该用户</a>
          }
          modalTitle="请认真填写举报信息"
          confirmBtnText="提交"
        >
          <ReportUserForm />
        </Confirm>
      </li>
    </ul>
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
        like: 224
      })
    }, 3000)
  }
  getPostDetail() {
    // let {match} = this.props
  }
  render () {
    let {title, like = 0, tags, view = 225, signature = "素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏"} = this.state
    let commonFooterIconOpt = {
      type: 'icon',
      iconSize: '.24rem',
      fontSize: '.2rem',
      btnPadding: '.2rem',
      color: '#666'
    }
    let commonOtherInfoIconOpt = Object.assign(commonFooterIconOpt, {iconSize: '.26rem', fontSize: '.24rem'})
    let authorIconOpt = Object.assign(commonFooterIconOpt, {fontSize: '.24rem'})
    let documentEleFontSize = document.documentElement.clientWidth * 50 / 1000
    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={16}>
              <main className={styles.postDetailMain}>
                <section className={styles.postContentSection}>
                  <header className={styles.postTitleWrapper}>
                    <h2 className="postTitle">{title}</h2>
                    <Popover content={this.reportAuthorTemplate} placement="bottomRight">
                      <i className={styles.more}></i>
                    </Popover>
                  </header>
                  <article className={styles.postContent}>
                    <p>素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放，你的美一缕飘散，去到我去不了的地方，天青色等烟雨 而我在等你，炊烟袅袅升起 隔江千万里</p>
                  </article>
                  <footer className={styles.postInfoFooter}>
                    <IconBtn iconType="heart" iconBtnText={`${like}人喜欢`} {...commonFooterIconOpt} />
                    <IconBtn iconType="star" iconBtnText="收藏" {...commonFooterIconOpt} />
                    <IconBtn iconType="share-alt" iconBtnText="分享" {...commonFooterIconOpt} />
                  </footer>
                </section>
                <section className={styles.postCommentSection}>
                  <header className={styles.postCommentHeader}>
                    <h3 className={styles.commentTitle}>评论(220)</h3>
                    <Button icon="form">我要评论</Button>
                  </header>
                  <main>
                    <CommentItem number={1} />
                    <CommentItem number={2} />
                  </main>
                  <footer className={styles.commentBoxWrapper}>
                    <CommentBox />
                  </footer>
                </section>
              </main>
            </Col>
            <Col span={8}>
              <Affix offsetTop={1.8 * documentEleFontSize}>
                <div className={styles.postOtherInfo}>
                  <ul className={styles.postTags}>
                    {tags.map(tag => <li>
                      <Tag
                        key={tag}
                        color={colorfulTags.find(ct => ct.name === tag).color}
                      >{tag}</Tag>
                    </li>)}
                  </ul>
                  <div className={styles.postOtherInfoIcon}>
                    <IconBtn iconType="clock-circle" iconBtnText="2018年11月22日 03:46" {...commonOtherInfoIconOpt} />
                  </div>
                  <div className={styles.postOtherInfoIcon}>
                    <IconBtn iconType="eye" iconBtnText={`${view}人看过`} {...commonOtherInfoIconOpt} />
                  </div>
                </div>
                <section className={styles.authorInfoSection}>
                  <header className={styles.authorInfoHeader}>
                    <h3>关于作者</h3>
                    <div className={styles.contactAuthorBtns}>
                      <IconBtn iconType="plus" iconBtnText="关注" {...authorIconOpt} />
                      <IconBtn iconType="message" iconBtnText="私信" {...authorIconOpt} />
                    </div>
                  </header>
                  <main className={styles.authorInfoMain}>
                    <div className={styles.avatarWrapper}>
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size="large" />
                    </div>
                    <div className={styles.authorInfo}>
                      <p><strong>京津冀</strong></p>
                      <span>关注Ta的人：1102</span>
                    </div>
                  </main>
                  <div className={styles.signature}>
                    <strong>签名：</strong>
                    {signature}
                  </div>
                </section>
              </Affix>
            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

PostDetail.propTypes = {
};

export default PostDetail;
