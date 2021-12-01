import { CAPTUREDIMAGE } from "../action";


const initialState = {
    capturedImage: null
};

export default function ImageReducer(state = initialState, { type, payload }) {
    switch (type) {
        case CAPTUREDIMAGE:
            return { capturedImage: payload }
        default:
            return state;
    }
}