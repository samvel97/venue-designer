import { AnyAction, CaseReducerActions, Dispatch } from '@reduxjs/toolkit';

export type Dispatchers<T extends CaseReducerActions<any, any>> = {
  [key in keyof T]: T[key] extends (...params: any[]) => any
    ? (...params: Parameters<T[key]>) => void
    : () => void;
};

export function createDispatchers<T extends CaseReducerActions<any, any>>(actions: T) {
  return function (dispatch: Dispatch<AnyAction>): Dispatchers<T> {
    
    return Object.keys(actions).reduce((dispatchers, key: keyof T): Dispatchers<T> => {
      dispatchers[key] = (...params: any[]) =>
        dispatch((actions[key] as (...params: any[]) => any).call(null, ...params));

      return dispatchers;
    }, {} as Dispatchers<T>);
  };
}
