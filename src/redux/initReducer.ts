import type { ReduxInterface } from "../interface/main.interface";

const initialState: ReduxInterface = {
    login: false,
    authen: {
        pwd: "",
        token: "",
        input: "",
        username: "",
        login: false,
        incharge: "",
        vendername: "",
        role: ""
    }
}

const IndexReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                login: true,
                authen: {
                    ...state.authen,
                    ...action.payload,
                    login: true
                }
            }
        case 'LOGOUT':
            // return {
            //     ...state,
            //     authen: {
            //         pwd: "",
            //         token: "",
            //         input: "",
            //         username: ""
            //     },
            //     login: false,
            // };
             return initialState;

        default:
            return state;
    }
}

export default IndexReducer;