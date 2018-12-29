/*
* @Author: Jack.Hu
* @Date:   2018-11-30 22:51:22
* @Last Modified by:   Jackhzh
* @Last Modified time: 2018-12-28 16:27:01
*/
import React                                from 'react';
import { Row, Col, Checkbox,Select,Input }  from 'antd';
import { Router, Route, Switch }            from 'dva/router';
import FixedHeader                          from 'components/common/FixedHeader';
import RichEditor                           from 'utils/rich-editor/index.js';
import Drawer                               from './DoubleDrawer/index.js';

import styles                               from './index.scss';

const Option = Select.Option;

class Publish extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detail : "",
            totalCoin : 4566
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
    onChange(e) {
        console.log(`checked = ${e.target.checked}`);
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    inputChange(e) {
        let name = e.target.name,
            value = e.target.value.trim();//trim()去掉前后空白
        this.setState({
            [name] : parseInt(value)
        });
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
                    <Col span={16} offset={6}>
                        <Col span={3}>
                            <Select defaultValue="分享帖" style={{ width: 88 }} onChange={this.handleChange}>
                                <Option value="share">分享帖</Option>
                                <Option value="help">求助帖</Option>
                            </Select>
                        </Col>
                        <Col span={3}>
                            <div className={styles.bottomSancai}>
                                是否设置散财功能？<Checkbox onChange={this.onChange}></Checkbox>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className={styles.bottomSancai}>
                                为每个用户奖励<Input 
                                                name="coin" 
                                                size="small" 
                                                style={{ width: 40 }}
                                                onChange={(e) => this.inputChange(e)}/>
                                金币，共奖励<Input 
                                                name="people" 
                                                size="small" 
                                                style={{ width: 40 }}
                                                onChange={(e) => this.inputChange(e)}/>人
                                                
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className={styles.total}>
                                总共需要支付金币
                                {this.state.coin && this.state.people ? this.state.coin*this.state.people : 0}，您的金币数量为{this.state.totalCoin}
                            </div>
                        </Col>
                    </Col>
                    
                </div>
                {/*
                <div>
                    <Col span={12} offset={6}>
                        <button type="submit" className={styles.btnArea}>提交</button>
                    </Col>
                </div>
                */}
                
                <Drawer/>
            </div>


        );
    }

}

export default Publish;