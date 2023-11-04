import applyMiddleware from "./applyMiddleware.js";
import combineReducers from "./combineReducer.js";
import createStore from "./createStore.js";



function counterReducer(state= 0, action) {
    switch (action.type) {
        case "ADD_ONE":
            // action.dispatch({})
            return state + 1;
        default:
            return state;
    }
}

function nameReducer(state = {name:""}, action) {
    switch (action.type) {
        case "CHANGE_NAME":
            // action.dispatch({})
            return {
                ...state,
                name: action.payload.name
            };
        default:
            return state;
    }
}

const reducer = combineReducers({
    counter: counterReducer,
    name: nameReducer
})

const middleware1 = store => next => data => {
    console.log(" == middleware 1",store,data)
    next(data)
}

const middleware2 = store => next => data => {
    console.log(typeof next," == middleware 2",store,data)
    next(data)
}

// Example - with preloaded state
// const preloadedStore = createStore(reducer,{number:10})
// preloadedStore.getState() // {number: 10}

// Example - without preloaded state
const store = createStore(reducer,null,applyMiddleware([middleware1,middleware2]))
window.store = store


// store.getState() // {number: 0}

// store.subscribe(()=>{
//     console.log("store changes " + store.getState().number)
// })

// store.dispatch({type:"ADD_ONE"})
// // store changes 1
// store.getState() // {number:1} 

// // Example - prevent dispatch,subscribe & getState inside reducer
// const someReducer = (state,action) => {

//     // .......

//     action.dispatch() // Reducers may not dispatch actions
//     action.subscribe() // You may not call store.subscribe() while .....
//     action.getState() // You may not call store.getState() while ......

// }