import {popupActionType} from './PopupActions';

const initPopupState = {
  open: false,
  type: '',
  component: null,
  actions: [],  
};

const popup = (state = initPopupState, action) => {
  switch (action.type) { 
    case popupActionType.openAction:
      return {
        ...state,
        open: true,
        type: 'action',
        actions: action.actions,
      };   
    case popupActionType.openCustom: {
      return {
        ...state,
        open: true,
        type: 'custom',
        component: action.component,
        onPressOut: action.onPressOut,
        noTouchFlag: action.noTouchFlag,        
      };
    }    
    case popupActionType.close:
      return initPopupState;
    default:
      return state;
  }
};

export default popup;
