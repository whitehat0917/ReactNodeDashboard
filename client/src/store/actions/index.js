import {
    SETMULTIIP
} from './types';

export const setMultiIp = (multiIp) => {
    return {
        type: SETMULTIIP,
        payload: { multiIp }
    }
}