import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Debug from './containers/Debug';
import Quilt from './containers/Quilt';

export default class View {

  constructor(viewModel, store) {
    this.viewModel = viewModel;
    this.store = store;
  }

  getComponent() {
    switch (window.wellcome_page) {
      case 'prototype':
        return <Quilt />;
      case 'debug':
      default:
        return <Debug />;
    }
  }

  mountComponent(el) {
    ReactDOM.render((
        <Provider store={ this.store }>
          { this.getComponent()  }
        </Provider>
    ), el);
  }

}
