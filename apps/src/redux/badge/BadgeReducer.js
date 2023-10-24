import {badgeActionType} from './BadgeActions';

const initBadge = {
  cnt: 0,
  s_cnt:0,
};

const badge = (state = initBadge, action) => {  
  switch (action.type) {
    case badgeActionType.chat:
      return {
        ...state,
        cnt: action.cnt,
        s_cnt:action.s_cnt
      };
    default:
      return state;
  }
};

export default badge;
