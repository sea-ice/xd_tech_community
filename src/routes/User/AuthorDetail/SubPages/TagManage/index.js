import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import categories from '../../../../../config/categoryTags.json'
import styles from './index.scss'

class AuthorPosts extends Component {
  constructor (props) {
    super(props)
    this.state= {
      myTag: ["Python", "Material Design", "Android Studio"],
      categories,
      myTagNumber:0
    }
  }
  check=(e)=>{
    var clickObj=e.target.getAttribute("data-name");
    var myTag=this.state.myTag;
    var exist=myTag.findIndex(function(value){
        return value==clickObj;
      })
    if(exist!=-1){
      myTag.splice(exist,1);
    }else{
      if(myTag.length>2){
        alert("只能添加3个标签哦~")
      }else{
        myTag.push(clickObj);
      }
    }
    this.setState({
      myTag
    })
  }
  render(){
    var obj=this;
    return(
      <div className={styles.page}>
        <div className={styles.head}>
          <div>我的标签（3/3）：</div>
          <div className={styles.content}>{
            this.state.myTag.map(function(value,key){
              return <div key={key} className={styles.checkTag} data-name={value} onClick={(e)=>{obj.check(e)}}>{value}</div>
            })
          }</div>
        </div>
        <div className={styles.all}>
          <div>全部标签：</div>
          <button className={styles.btnYl}>确认</button>
        </div>
        {
          this.state.categories.map(function(value,key){
            return(
              <div key={key}>
                <div className={styles.tags}>
                  {value.name}
                  <div className={styles.content}>
                  {
                    value.tags.map(function(item,index){
                      return(
                        <div key={index} className={styles.tag}>
                            <div data-name={item.name} onClick={(e)=>{obj.check(e)}}>
                              {item.name}
                            </div>
                        </div>
                      )
                    })
                  }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
