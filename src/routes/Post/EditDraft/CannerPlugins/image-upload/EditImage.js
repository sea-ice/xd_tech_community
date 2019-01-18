import React, { Component } from "react";
import { Modal } from "antd";
import {IntlProvider, FormattedMessage, addLocaleData} from 'react-intl';
import Container from './Container';

import enLocale from './locale/en';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

addLocaleData([...en, ...zh]);

export default class EditImage extends Component {

  static defaultProps = {
    locale: 'en',
    multiple: false,
    localeMessages: enLocale,
    onChange: (arg) => arg,
    editProps: false,
    galleryConfig: null
  }

  render() {
    const {
      locale,
      localeMessages,
      editPopup,
      closeEditPopup
    } = this.props;
    return (
      <IntlProvider
        locale={locale}
        defaultLocale="en"
        messages={localeMessages}>
        <Modal
          visible={editPopup}
          closable={true}
          width={700}
          onCancel={closeEditPopup}
          title={
            <FormattedMessage id="imgupload.title"/>
          }
          footer={null}
          maskClosable={true}
        >
          <Container {...this.props}/>
        </Modal>
      </IntlProvider>
    );
  }
}
