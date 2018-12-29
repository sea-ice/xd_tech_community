import React, { Component } from 'react'
import { Form, Input, Select, Cascader } from 'antd'
import { getSchoolOptions, getLocationOptions, findSchoolInfo, locationSplit } from 'utils'
import memoize from 'fast-memoize'

import styles from './index.scss'

class AuthorInfoForm extends Component {
  componentDidMount() {
    this.props.onRef(this)
  }
  getSchoolOptions = memoize(getSchoolOptions);
  getLocationOptions = memoize(getLocationOptions);
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
    let { form, authorInfo } = this.props
    let { getFieldDecorator } = form
    let { nickName, gender, school, education, location, label, introduction } = authorInfo
    let fieldLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } }

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
          <Form.Item {...fieldLayout} label="个人介绍">
            {
              getFieldDecorator('introduction', {
                initialValue: introduction
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

export default Form.create({})(AuthorInfoForm);