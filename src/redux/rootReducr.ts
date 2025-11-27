import { combineReducers } from "redux";
import reducer from "./initRoducer";

const rootReducer = combineReducers({
    reducer: reducer,
})

export default rootReducer;