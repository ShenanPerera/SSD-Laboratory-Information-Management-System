import { createContext, useReducer, useEffect }  from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN' :
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        // case 'SET_OAUTH_USER':
        //     return { user: {...state.user, oauthUser: action.payload}}
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state,dispatch] = useReducer(authReducer, {
        user:null
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if(user) {
            dispatch({type:'LOGIN',payload: user})
        }
    }, [])

    console.log('AuthContext state ', state)

    // const setOauthUser = (oauthUser) => {
    //     dispatch({type: 'SET_OAUTH_USER', payload: oauthUser})
    //     localStorage.setItem('user', JSON.stringify({...state.user, oauthUser}))
    // }

    return(
        <AuthContext.Provider  value= {{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

