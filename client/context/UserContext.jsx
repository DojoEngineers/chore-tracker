import { useState, useEffect, useContext, createContext } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext()

export const useLogin = () => useContext(UserContext)

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [loggedInData, setLoggedInData] = useState({})
    const [familyData, setFamilyData] = useState([])

    useEffect(() => {
        const loadUser = async () => {
            try {
                console.log("getting token from storage...")
                const storedUser = await AsyncStorage.getItem('user')
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                }
            } catch (error) {
                console.log('Failed to load user', error)
            }
        }
        loadUser()
    }, [])

    const login = async (userData) => {
        console.log("in context's login.")
        setIsLoggedIn(true)
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            console.log("set user", userData)
            return userData
        } catch (e) {
            console.log('Failed to save user', e);
        }
    }

    const logout = async () => {
        try{
            await AsyncStorage.removeItem('user');
        }
        catch (error) {
            console.log("failed to remove from storage")
        }
        setUser(null)
        setIsLoggedIn(false)
        setLoggedInData(null)
        setFamilyData([])
    }

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, loggedInData, familyData, setFamilyData, setLoggedInData, login, logout, isLoggingOut, setIsLoggingOut}}>
            {children}
        </UserContext.Provider>
    )
}