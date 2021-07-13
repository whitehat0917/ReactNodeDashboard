import {
    SETMULTIIP
} from '../actions/types';

const initialState = {
    multiIp: false
}

const admin = (state = initialState, action) => {
    switch (action.type) {
        case SETMULTIIP:
            {
                const { multiIp } = action.payload;
                return {
                    ...state,
                    multiIp: multiIp
                }
            }
        default:
            return state;
    }
}

export default admin;