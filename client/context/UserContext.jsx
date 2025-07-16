import { useState, useContext, createContext } from "react"

const UserContext = createContext()

export const useLogin = () => useContext( UserContext )

export const UserContextProvider = ( { children } ) => {
    const [ isLoggedIn, setIsLoggedIn ] = useState( false )
    const [loggedInData, setLoggedInData] = useState({})
    const [familyData, setFamilyData] = useState([])

    const login = () => {
        setIsLoggedIn( true )
    }

    const logout = () => {
        setIsLoggedIn( false )
        setLoggedInData(null)
        setFamilyData([])
    }

    return(
        <UserContext.Provider value={{ isLoggedIn, login, logout }}>
            { children }
        </UserContext.Provider>
    )
}