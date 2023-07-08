
const initialState = {
    file: undefined
}

const fileReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'add':
            return {file: state.file}
        case 'remove':
            return {file: undefined}
        default:
            return state
    }
}

