import { combineReducers } from "redux";
import reducer from "./initReducer";

const rootReducer = combineReducers({
    reducer: reducer,
})

export default rootReducer;