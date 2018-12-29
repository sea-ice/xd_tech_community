/*
* @Author: Jackhzh
* @Date:   2018-12-28 10:51:57
* @Last Modified by:   Jackhzh
* @Last Modified time: 2018-12-28 21:07:29
*/
import React              from 'react';
import { Drawer, Button } from 'antd';
import categories         from 'config/categoryTags.json';

import styles             from './index.scss';

class DoubleDrawer extends React.Component {
  constructor (props) {
    super(props)
    this.state= {
      categories,
      tag : []
    }
  }

  state = { visible: false, childrenDrawer: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  check=(e)=>{
      var clickObj=e.target.getAttribute("data-name");
      var tag=this.state.tag;
      var exist=tag.findIndex(function(value){
          return value==clickObj;
        })
      if(exist!=-1){
        tag.splice(exist,1);
      }else{
        if(tag.length>2){
          alert("只能添加3个标签哦~")
          return
        }else{
          tag.push(clickObj);
        }
      }
      this.setState({
        tag : tag
      })
      console.log(this.state.tag);
  };



  render() {
    let that = this;
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          标签选择
        </Button>
        <Drawer
          title="标签选择"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          
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
                              <div data-name={item.name} onClick={(e)=>{that.check(e)}}>
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
          
        </Drawer>
      </div>
    );
  }
}

export default DoubleDrawer;