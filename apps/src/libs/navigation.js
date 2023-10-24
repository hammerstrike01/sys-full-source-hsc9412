import {NavigationActions, StackActions} from 'react-navigation';
let _navigator;

export const goBack = () => {
  _navigator.dispatch(NavigationActions.back());
};

export const replace = (name, params) => {
  _navigator.dispatch(
    StackActions.replace({
      routeName: name,
      params,
    }),
  );
};
export const goTop = () => {
  _navigator.dispatch(
    StackActions.popToTop()
  );
};
export const getCurrentRouteKey = () => {
  let key = '';

  if (!_navigator) {
    return;
  }
  if (!_navigator.state) {
    return;
  }
  const root =
    _navigator.state.nav.routes[_navigator.state.nav.routes.length - 1];

  if (root.routes) {
    if (root.routes.length > 0) {
      key = root.routes[root.routes.length - 1].routeName;
    }
  } else {
    key = root.key;
  }
  return key;
};

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}
export function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}
