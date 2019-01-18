import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Select, Cascader } from 'antd'
import { getSchoolOptions, getLocationOptions, findSchoolInfo, locationSplit } from 'utils/options'
import memoize from 'fast-memoize'

import styles from './index.scss'

@connect(state => ({
  introductionEditLength: state.author.authorInfo.introductionEditLength
}))
@Form.create({
  onFieldsChange(props, fields) {
    let fieldName = Object.keys(fields)[0]
    let { dispatch } = props
    if (fieldName === 'introduction') {
      dispatch({
        type: 'author/setInfo',
        payload: {
          key: 'authorInfo',
          newInfo: {
            introductionEditLength: fields[fieldName].value.length
          }
        }
      })
    }
  }
})
class AuthorInfoForm extends Component {
  constructor(props) {
    super(props)
    this.INTRODUCTION_MAX_LENGTH = 100
  }
  componentDidMount() {
    this.props.onRef(this)
    this.setIntroductionEditLength()
  }
  getSchoolOptions = memoize(getSchoolOptions);
  getLocationOptions = memoize(getLocationOptions);
  setIntroductionEditLength() {
    // 初始化个人介绍的长度
    let { dispatch, authorInfo } = this.props
    let { introduction } = authorInfo

    dispatch({
      type: 'author/setInfo',
      payload: {
        key: 'authorInfo',
        newInfo: {
          introductionEditLength: introduction.length
        }
      }
    })
  }
  checkValid() {
    let { form } = this.props
    form.validateFields()
    let validateErr = form.getFieldsError()
    let hasValidateErr = Object.keys(validateErr).some(key => !!validateErr[key])
    if (hasValidateErr) return false
    return true
  }
  getFieldValues() {
    let fieldValues = this.props.form.getFieldsValue()
    fieldValues.gender = Number(fieldValues.gender)
    fieldValues.school = fieldValues.school[1]
    fieldValues.location = fieldValues.location.join('')
    return fieldValues
  }
  render() {
    let { form, authorInfo, introductionEditLength } = this.props
    let { getFieldDecorator } = form
    let { nickName, gender, school, education, location, introduction } = authorInfo
    let fieldLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

    return (
      <div className={styles.formWrapper}>
        <Form layout="horizontal">
          <Form.Item {...fieldLayout} label="昵称">
            {
              getFieldDecorator('nickName', {
                rules: [
                  { required: true, message: '请填写昵称！' }
                ],
                initialValue: nickName
              })(
                <Input size="large" placeholder="请填写昵称" />
              )
            }
          </Form.Item>
          <Form.Item {...fieldLayout} label="性别">
            {
              getFieldDecorator('gender', {
                initialValue: String(gender)
              })(
                <Select size="large">
                  <Select.Option value="1">男</Select.Option>
                  <Select.Option value="0">女</Select.Option>
                  <Select.Option value="2">保密</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item {...fieldLayout} label="学校">
            {
              getFieldDecorator('school', {
                initialValue: findSchoolInfo(school)
              })(
                <Cascader size="large" options={this.getSchoolOptions()} placeholder="请选择所在学校" />
              )
            }
          </Form.Item>
          <Form.Item {...fieldLayout} label="学历">
            {
              getFieldDecorator('education', {
                initialValue: education
              })(
                <Select size="large" placeholder="请选择学历">
                  <Select.Option value="大专及以下">大专及以下</Select.Option>
                  <Select.Option value="本科">本科</Select.Option>
                  <Select.Option value="研究生">研究生</Select.Option>
                  <Select.Option value="博士及以上">博士及以上</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item {...fieldLayout} label="地区">
            {
              getFieldDecorator('location', {
                initialValue: locationSplit(location)
              })(
                <Cascader size="large" options={this.getLocationOptions()} placeholder="请选择所在地区" />
              )
            }
          </Form.Item>
          <Form.Item
            {...fieldLayout}
            label={`个人介绍(${introductionEditLength}/${this.INTRODUCTION_MAX_LENGTH})`}
          >
            {
              getFieldDecorator('introduction', {
                initialValue: introduction,
                rules: [
                  { max: 140, message: `字数不能超过${this.INTRODUCTION_MAX_LENGTH}字！` }
                ]
              })(
                <Input.TextArea size = "large" autosize={{minRows: 3}} placeholder = "请填写个人介绍" />
              )
            }
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default AuthorInfoForm;