import compose from "./compose.js"

const applyMiddleware = middlewares => createStore => (reducer,initialState) => {
    const store = createStore(reducer,initialState)
    const chain = middlewares.map(middleware => middleware(store))
    const dispatch = compose(chain)(store.dispatch)

    return {
        ...store,
        dispatch
    }
}

export default applyMiddleware