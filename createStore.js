


// Default action types
 export const ActionTypes = {
    INIT: "@REDUX_INIT" + Math.random(),
    REPLACE: "@REDUX_REPLACE" + Math.random(),
    UNKNOWN: "@REDUX_UNKNOWN" + Math.random(),
 }

 /**
 * A function that creates a store
 * @param {Function} A reducer function
 * @param {Any} Initial state
 * @returns {Store} that allows to read state, dispatch & subscribe
 */

const createStore = (reducer,preloadedState,enhancer) => {

    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners =  [];
    // Based on this "isDispatching" variable redux prevent us to call
    // subscribe, getState & dispatch method inside reducer
    let isDispatching = false


    // If Middlewares are available then create store with middlewares
    if(enhancer){
      return  enhancer(createStore)(reducer,preloadedState)
    }

    /**
     * simply returns current state from the store
     * @returns Current state
     */

    const getState = () => {
        
        if (isDispatching) {
            throw new Error('You may not call store.getState() while the reducer is executing')
        }

        return currentState
    }

    /**
     * Adds a change listener
     * @param {Function} Invoke whenever the state changes
     * @returns {Function} A function for unsubscribe
     */
    const subscribe = (listener,depenciesFunc) => {

        if (isDispatching) {
            throw new Error('You may not call store.subscribe() while the reducer is executing')
        }

        let isSubscribed = true

        if(depenciesFunc){
            listener.depenciesFunc = depenciesFunc
            console.log("depenc added")
        }
        // stores the listener to invoke on every state changes 
        currentListeners.push(listener)

        // return a unsubscribe method
        return function unsubscribe(){

            // prevent calling unsubscribe method more than once
            if (!isSubscribed) return

            isSubscribed = false

            const index = currentListeners.indexOf(listener)
            currentListeners.splice(index, 1)
        }
    }

    /**
     * A function that Dispatches an action to chanage the state.
     * @param {object} action A plain object representing “what changed”
     * @returns {object} the same action object you dispatched.
     */
    const dispatch = (action) => {
        
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }

        try {
        
            /**
             * To update the state whenever we call the "dispatch" method 
             * it invokes the "currentReducer"/Reducer method
             * that we have passed to create the store 
             */
            isDispatching = true
            var newState = currentReducer(currentState, action)
            currentState = newState
        } finally{
            isDispatching = false
        }

        //  Then it calls all the subscribed listeners
        const listeners = currentListeners
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            if(listener.depenciesFunc){
                console.log("found dependency",listener.depenciesFunc(currentState))
            }
            listener()
        }

        return action
    }

    /**
     * Replace the current reducer with new one
     * @param {Function} New reducer function
     */

    const replaceReducer =(nextReducer) => {

        if (typeof nextReducer !== 'function') {
            throw new Error('Expected the nextReducer to be a function.')
        }

        currentReducer = nextReducer
        dispatch({ type: ActionTypes.REPLACE })
    }

    // Interoperability point for observable/reactive libraries
    const observable = () => {};

    // Redux dispatch this INIT action to get 
    // the initial state from the reducer
    dispatch({type: ActionTypes.INIT});

    return{
        getState,
        subscribe,
        dispatch,
        replaceReducer,
        // IGNORE THIS METHOD FOR NOW
        observable
    }
}

export default createStore



