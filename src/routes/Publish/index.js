/*
* @Author: Jack.Hu
* @Date:   2018-11-30 22:51:22
* @Last Modified by:   Jack.Hu
* @Last Modified time: 2018-12-01 15:38:09
*/
import React                        from 'react';
import { Router, Route, Switch }    from 'dva/router';
import FixedHeader                  from 'components/common/FixedHeader';
import RichEditor                   from 'utils/rich-editor/index.js'

import styles                       from './index.scss'

class Publish extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detail : ""
        }
    }
    // 富文本编辑器的变化
    onDetailValueChange(value){
        console.log(value);
        this.setState({
            detail: value
        });
    }
    onValueChange(e){
        console.log(e);
    }
    render(){
        return (
            <div className="app-container">
                <FixedHeader />
                <div className={styles.richEditor}>
                    <div className="col-md-offset-2 col-md-8">
                        <RichEditor
                            onValueChange={(value) => this.onDetailValueChange(value)}/>
                    </div>
                </div>
                <div>
                    <div className="col-md-offset-2 col-md-8">
                        <button type="submit" className={styles.btnArea}>提交</button>
                    </div>
                </div>
            </div>
                 
            
        );
    }
    
}

export default Publish;