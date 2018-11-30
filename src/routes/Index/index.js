import React, {Component} from 'react';
import { connect } from 'dva';
import {Row, Col, Tabs} from 'antd'

import styles from './index.css'
import FixedHeader from 'components/common/FixedHeader'
import IconBtn from 'components/common/IconBtn'
import PostFilterByLabel from 'components/PostFilterByLabel'
import StickPostItem from 'components/Post/StickPostItem'
import PlainPostItem from 'components/Post/PlainPostItem';

class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.toggleCollapse = this.toggleCollapse.bind(this)
    this.refreshOnTagChange = this.refreshOnTagChange.bind(this)
    this.state = {
      postFilterCollapse: false
    }
  }
  toggleCollapse () {
    let {postFilterCollapse} = this.state
    postFilterCollapse = !postFilterCollapse
    this.setState({
      postFilterCollapse
    })
  }
  refreshOnTagChange(newTags) {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }
  render () {
    let {postFilterCollapse} = this.state
    let postFilterIconOpt = {
      lineHeight: '45px',
      onIconClick: this.toggleCollapse
    }
    let filterIconBtn = postFilterCollapse ? <IconBtn
      iconClassName={styles.filterIcon}
      iconBtnText="筛选"
      {...postFilterIconOpt} /> : <IconBtn
      iconClassName={styles.collapseIcon}
      iconBtnText="收起"
      {...postFilterIconOpt} />

    let postFilter = <PostFilterByLabel
    refreshOnTagChange={this.refreshOnTagChange}
    collapse={postFilterCollapse} />

    let stickPosts = [{
      id: 1,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标，一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }, {
      id: 2,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }, {
      id: 3,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }]

    let plainPosts = [{
      id: 11,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标，一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      avatarURL: 'https://www.baidu.com/link?url=dLjfYi6oXheNOfFQWRr6w208a9CtPV2v1eTsoS3nqcIxCo2JoOeQ-6k0q6qJw8CF5DnWFAlNhdFuHDkGbP-EJo0tpiKfnpstpGbmtrvtfiQ6BlOiAgff5NM_ztlITCfrpG0fHxJo3fbJmJRCUhzB4rLDC9urYP6NnMqMYr7StKqpmbrymB_aqZoMF15naNGf5LuajqgKkvFOkwuApEKCOIeUAvAZ4CFWcDvoDaEos9FRADcI32y8VH98J7BlsOc4k3VxA7T0BG1z2XlEVlDGFZttHUscQb4XrGamdph7gUFY9bYabWaisJYuPWIbbBge6qVnEwNRNDq_sFn9K75M740VmATGTWPF8NY7_2TWCuDt7U40LmydDI9_Owa-spOOzXeDrIb6KWSpr08dNRbxtptrWDmNCTYyVCk2z8W6ZlrI3TSrLTVmLSIJ0UnM5oP96LnxF4l-UUjZcoCpzJbu4ggOWnnTnt55KHU03kIddUi_QwtwEfuIllSz7Sf27muB8Drq7CmONPkl4l4x8Qki6M-1Isqx_2m4BEu8b6ctrWuCH9CfqP8UbFr2BFNbLsdhq2NI3nJK6RM2DD41d013UIarZXSRFCURq6oMIABNmmy&wd=&eqid=9d672d1e0000eb40000000065bf12644',
      username: 'Jack',
      posterURL: 'http://img2.imgtn.bdimg.com/it/u=3533314869,3462486273&fm=200&gp=0.jpg',
      content: '素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放，你的美一缕飘散，去到我去不了的地方，天青色等烟雨 而我在等你，炊烟袅袅升起 隔江千万里',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }, {
      id: 22,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      avatarURL: 'https://www.baidu.com/link?url=dLjfYi6oXheNOfFQWRr6w208a9CtPV2v1eTsoS3nqcIxCo2JoOeQ-6k0q6qJw8CF5DnWFAlNhdFuHDkGbP-EJo0tpiKfnpstpGbmtrvtfiQ6BlOiAgff5NM_ztlITCfrpG0fHxJo3fbJmJRCUhzB4rLDC9urYP6NnMqMYr7StKqpmbrymB_aqZoMF15naNGf5LuajqgKkvFOkwuApEKCOIeUAvAZ4CFWcDvoDaEos9FRADcI32y8VH98J7BlsOc4k3VxA7T0BG1z2XlEVlDGFZttHUscQb4XrGamdph7gUFY9bYabWaisJYuPWIbbBge6qVnEwNRNDq_sFn9K75M740VmATGTWPF8NY7_2TWCuDt7U40LmydDI9_Owa-spOOzXeDrIb6KWSpr08dNRbxtptrWDmNCTYyVCk2z8W6ZlrI3TSrLTVmLSIJ0UnM5oP96LnxF4l-UUjZcoCpzJbu4ggOWnnTnt55KHU03kIddUi_QwtwEfuIllSz7Sf27muB8Drq7CmONPkl4l4x8Qki6M-1Isqx_2m4BEu8b6ctrWuCH9CfqP8UbFr2BFNbLsdhq2NI3nJK6RM2DD41d013UIarZXSRFCURq6oMIABNmmy&wd=&eqid=9d672d1e0000eb40000000065bf12644',
      username: 'Jack',
      posterURL: 'http://img2.imgtn.bdimg.com/it/u=3533314869,3462486273&fm=200&gp=0.jpg',
      content: '素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放，你的美一缕飘散，去到我去不了的地方，天青色等烟雨 而我在等你，炊烟袅袅升起 隔江千万里',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }, {
      id: 33,
      title: '一键拖拽使用 Ant Design 和 Iconfont 的海量图标',
      avatarURL: 'https://www.baidu.com/link?url=dLjfYi6oXheNOfFQWRr6w208a9CtPV2v1eTsoS3nqcIxCo2JoOeQ-6k0q6qJw8CF5DnWFAlNhdFuHDkGbP-EJo0tpiKfnpstpGbmtrvtfiQ6BlOiAgff5NM_ztlITCfrpG0fHxJo3fbJmJRCUhzB4rLDC9urYP6NnMqMYr7StKqpmbrymB_aqZoMF15naNGf5LuajqgKkvFOkwuApEKCOIeUAvAZ4CFWcDvoDaEos9FRADcI32y8VH98J7BlsOc4k3VxA7T0BG1z2XlEVlDGFZttHUscQb4XrGamdph7gUFY9bYabWaisJYuPWIbbBge6qVnEwNRNDq_sFn9K75M740VmATGTWPF8NY7_2TWCuDt7U40LmydDI9_Owa-spOOzXeDrIb6KWSpr08dNRbxtptrWDmNCTYyVCk2z8W6ZlrI3TSrLTVmLSIJ0UnM5oP96LnxF4l-UUjZcoCpzJbu4ggOWnnTnt55KHU03kIddUi_QwtwEfuIllSz7Sf27muB8Drq7CmONPkl4l4x8Qki6M-1Isqx_2m4BEu8b6ctrWuCH9CfqP8UbFr2BFNbLsdhq2NI3nJK6RM2DD41d013UIarZXSRFCURq6oMIABNmmy&wd=&eqid=9d672d1e0000eb40000000065bf12644',
      username: 'Jack',
      posterURL: 'http://img2.imgtn.bdimg.com/it/u=3533314869,3462486273&fm=200&gp=0.jpg',
      content: '素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏，而你嫣然的一笑如含苞待放，你的美一缕飘散，去到我去不了的地方，天青色等烟雨 而我在等你，炊烟袅袅升起 隔江千万里',
      publishTime: '2018/11/06',
      tags: ['HTML', 'CSS', 'JavaScript'],
      like: 723,
      view: 2454,
      comment: 892
    }]
    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={16}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={filterIconBtn}>
                  <Tabs.TabPane tab="分享" key="sharePosts">
                    {postFilter}
                    <ul>
                      {stickPosts.map(p => <StickPostItem key={p.id} {...p} />)}
                      {plainPosts.map(p => <PlainPostItem key={p.id} {...p} />)}
                    </ul>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="求助" key="helpPosts">
                    {postFilter}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="关注" key="attention">

                  </Tabs.TabPane>
                </Tabs>
              </div>
            </Col>
            <Col span={8}>

            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
