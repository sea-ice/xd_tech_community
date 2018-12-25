/*
* @Author: Jack.Hu
* @Date:   2018-11-30 22:51:22
* @Last Modified by:   Jackhzh
* @Last Modified time: 2018-12-10 16:27:32
*/
import React                        from 'react';
import { Row, Col }                 from 'antd';
import { Router, Route, Switch }    from 'dva/router';
import FixedHeader                  from 'components/common/FixedHeader';
import RichEditor                   from 'utils/rich-editor/index.js';

import styles                       from './index.scss';

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
            <div>
                <FixedHeader />
                <div className={styles.richEditor}>
                    <Col span={12} offset={6}>
                        <RichEditor
                            onValueChange={(value) => this.onDetailValueChange(value)}/>
                    </Col>
                </div>
                <div>
                    <Col span={12} offset={6}>
                        <button type="submit" className={styles.btnArea}>提交</button>
                    </Col>
                </div>
            </div>


        );
    }

}

export default Publish;