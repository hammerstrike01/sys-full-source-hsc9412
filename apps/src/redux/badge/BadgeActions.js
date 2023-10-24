export const badgeActionType = {
  chat: 'chat',  
};

export const badgeDisplay = ({cnt,s_cnt}) => dispatch => {  
  dispatch({type: badgeActionType.chat, cnt,s_cnt});
};
