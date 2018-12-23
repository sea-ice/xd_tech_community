// 我关注的人
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Input, Badge, Icon, Avatar, message} from 'antd';

import styles from './index.scss'

class AuthorPosts extends Component {
  constructor (props) {
    super(props);
    this.state={
      following:22,
      list:[
        {head:"http://b-ssl.duitang.com/uploads/item/201601/26/20160126100524_5sAiT.jpeg",
          name:"用户昵称",
          beizhu:"备注",
          slogan:"签名",
          following:true,
          id:1
        },
        {head:"http://b-ssl.duitang.com/uploads/item/201601/26/20160126100524_5sAiT.jpeg",
          name:"用户昵称",
          beizhu:"",
          slogan:"签名",
          following:false,
          id:2
        },

      ]
    }
  }
  // 搜索
  handleUserSearch=(e)=>{

  }
  //鼠标移入
  mouseEnter=()=>{
    console.log(123)
}
mouseLeave=(e)=>{

}
  render () {
    let Search = Input.Search
    return (
      <div className={styles.page}>
        <div className={styles.head}>
          <div className={styles.left}>关注：{this.state.following}</div>
          <Search className={styles.search}
            placeholder="输入备注或昵称"
            onSearch={this.handleUserSearch}
            enterButton />
        </div>
        <div>
          <ul>
          {this.state.list.map(function(value,key){
            return (
              <div key={key}>
                <li className={styles.list}>
                  <div className={styles.left}>
                    <img className={styles.headImg} src={value.head} alt=""/>
                    <div className={styles.info}>
                      <div className={styles.top}>
                        <div>{value.name}</div>
                        <div>{value.beizhu}</div>
                      </div>
                      <div className={styles.down}>
                        <div>{value.slogan}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <i className={styles.more}></i>
                    {/*{(()=>{*/}
                      {/*if (value.following) {*/}
                        {/*return <div>已关注</div>*/}
                      {/*} else {*/}
                        {/*return <div>未关注</div>*/}
                      {/*}*/}
                    {/*})()}*/}
                    <div>{value.following?'已关注':'取消关注'}</div>
                  </div>
                </li>
              </div>
            )
          })}
          </ul>
        </div>
      </div>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
