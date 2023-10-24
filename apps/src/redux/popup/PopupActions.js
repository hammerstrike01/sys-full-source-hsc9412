export const popupActionType = {
  openAction: 'popupOpenAction',  
  openCustom: 'popupOpenCustom',
  close: 'popupClose',
};

export const popupOpenAction = ({actions}) => dispatch => {
  dispatch({type: popupActionType.openAction, actions});
};

export const popupOpenCustom = ({component, onPressOut, noTouchFlag}) => dispatch => {
  dispatch({type: popupActionType.openCustom, component, onPressOut, noTouchFlag});
};

export const popupClose = dispatch => {
  dispatch({type: popupActionType.close});
};