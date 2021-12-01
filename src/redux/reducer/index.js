import ImageReducer from "./ImageReducer";
import { combineReducers } from 'redux';


let rootReducer = combineReducers({

    ImageReduce: ImageReducer

});


export default (state, action) => {
    return rootReducer(state, action);
};