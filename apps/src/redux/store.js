import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import popup from './popup/PopupReducer';
import badge from './badge/BadgeReducer';

export default createStore(
  combineReducers({
    popup: popup,
    badge:badge,
  }),
  {},
  applyMiddleware(thunk),
);