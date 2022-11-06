import createStore from "./createStore";


function reducer(state = {number:0}, action) {
    switch (action.type) {
        case "ADD_ONE":
            // action.dispatch({})
            return {
                number: state.number + 1
            };
        default:
            return state;
    }
}

// Example - with preloaded state
const preloadedStore = createStore(reducer,{number:10})
preloadedStore.getState() // {number: 10}

// Example - without preloaded state
const store = createStore(reducer)
store.getState() // {number: 0}

store.subscribe(()=>{
    console.log("store changes " + store.getState().number)
})

store.dispatch({type:"ADD_ONE"})
// store changes 1
store.getState() // {number:1} 

// Example - prevent dispatch,subscribe & getState inside reducer
const someReducer = (state,action) => {

    // .......

    action.dispatch() // Reducers may not dispatch actions
    action.subscribe() // You may not call store.subscribe() while .....
    action.getState() // You may not call store.getState() while ......

}