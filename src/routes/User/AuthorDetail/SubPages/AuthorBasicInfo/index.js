import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import IconBtn from '../../../../../components/common/IconBtn'
import styles from './index.scss'
import Complain from 'components/common/Complain'

class AuthorPosts extends Component {
  constructor (props) {
    super(props);
    this.state={
		name:"西电颜值巅峰",
		level:7,
		gender:"女",
		school:"西安电子科技大学",
		education:"研究生",
		slogan:"无趣之人",
		following:33,
		followed:5,
		coins:123,
		resolve:3,
      headImg:"http://b-ssl.duitang.com/uploads/item/201601/26/20160126100524_5sAiT.jpeg",
      tip:["html","css","js"]
    }
  }
  bigImg=()=>{
    console.log(this.state.headImg)
  }
  render () {

    return (
      <div className={styles.authorBasicInfo}>
      	<div className={styles.userHead}>
      		<img className={styles.headImg} src={this.state.headImg} alt=""/>
      		<button onClick={this.bigImg} className={styles.big}>查看大图</button>
      	</div>
		    <div className={styles.introduce}>
			    <div className={styles.title}>
            <div className={styles.left}>
              <div className={styles.name}>{this.state.name}</div>
              <IconBtn iconClassName={styles.writeIcon} color="#999" fontSize=".28rem" />
              <div>备注</div>
            </div>
            <Complain></Complain>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>用户等级</div>
            <div className={styles.level}>{this.state.level}<IconBtn iconClassName={styles.levelIcon} color="#999" fontSize=".28rem" /></div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>标签</div>
            <div className={styles.content}>
              <ul className={styles.tipUl}>
              {this.state.tip.map(function(value,key){
                return <li key={key} className={styles.tipLi}>{value}</li>
              })}
              </ul>
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>性别</div>
            <div className={styles.content}>{this.state.gender}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>学校</div>
            <div className={styles.content}>{this.state.school}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>签名</div>
            <div className={styles.content}>{this.state.slogan}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>她关注的人</div>
            <div className={styles.content}>{this.state.following}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>关注她的人</div>
            <div className={styles.content}>{this.state.followed}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>金币</div>
            <div className={styles.coin}>{this.state.coins}<IconBtn iconClassName={styles.whyIcon} color="#999" fontSize=".28rem" /></div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>已解答</div>
            <div className={styles.content}>{this.state.resolve}</div>
          </div>
          <div className={styles.list}>
            <div className={styles.tip}>学历</div>
            <div className={styles.content}>{this.state.education}</div>
          </div>
        </div>
      </div>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
