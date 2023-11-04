import { ActionTypes } from "./createStore.js"


/**
 * @param {Object} reducers as object
 * @returns {Fucntion} a combined functions of reducers
 */
const combineReducers = (reducers) => {
    const finalReducers = Object.keys(reducers)
    // check the reducer shape
    assertReducerShape(reducers)

    return function combination(state,action){
        let newStoreState = {};
        let hasChanged = false

        for (let index = 0; index < finalReducers.length; index++) {
            const key = finalReducers[index]
            const reducer = reducers[key];
            const prevState = state ? state[key] : undefined
            const nextState = reducer(prevState,action)
            newStoreState[key] = nextState

            hasChanged = hasChanged || nextState !== prevState
        }

        hasChanged = hasChanged || finalReducers.length !== Object.keys(state).length
        return hasChanged ? newStoreState : state
    }
}

/**
 * @param {Array} reducers 
 * Basically its checks all the reducers shape
 */
const assertReducerShape = (reducers) => {

    Object.keys(reducers).forEach(key => {
        const reducer = reducers[key]
        const initialState = reducer(undefined,{type: ActionTypes.UNKNOWN})
        if(initialState === undefined){
            throw new Error("GOT INITIAL STATE AS UNDEFINED DURING INITIALIZATION FROM REDUCER")
        }
    })

}
export default combineReducers