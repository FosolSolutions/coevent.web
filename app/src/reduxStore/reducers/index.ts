import { errorReducer } from "./errorReducers";
import { combineReducers } from "redux";
import { useSelector, TypedUseSelectorHook } from "react-redux";
// import { IErrorState } from "../actions";

export const rootReducer = combineReducers({
  error: errorReducer,
});

// interface RootState {
//   error: IErrorState;
// }

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
