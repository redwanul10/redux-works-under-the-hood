const compose = (middlewares) => {
    if(middlewares.length === 1) middlewares[0]

    return middlewares.reduce((a,b)=> (dispatch) => a(b(dispatch)))
}

export default compose;