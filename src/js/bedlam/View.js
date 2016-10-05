/**
 * View
 *
 * This view is actually more of a controller. Poorly named,
 * but it is the entry point of react in our application in
 * react. This file can be swapped out as needed if it has
 * its own mountComponent() method.
 *
 * This in theory allows you to use any view you like.
 *
 * @todo add in configure store to here.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Debug from './containers/Debug';
import MidFi from './containers/MidFi';
import Navigation from './containers/Navigation';
import Slider from './containers/Slider';
import Zoom from './containers/Zoom';
import Bedlam from './containers/Bedlam';

export default class View {

  constructor(viewModel, store) {
    this.viewModel = viewModel;
    this.store = store;
  }

  getComponent() {
    switch (window.wellcome_page) {
      case 'bedlam':
        return <Bedlam viewModel={ this.viewModel }/>;
      case 'debug':
        return <Debug viewModel={ this.viewModel }/>;
      case 'midfi':
        return <MidFi viewModel={ this.viewModel }/>;
      case 'zoom':
        return <Zoom viewModel={ this.viewModel }/>;
      case 'navigation':
        return <Navigation viewModel={ this.viewModel }/>;
      case 'slider':
        return <Slider viewModel={ this.viewModel }/>;
      default:
        return <div>Page not found</div>;
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
