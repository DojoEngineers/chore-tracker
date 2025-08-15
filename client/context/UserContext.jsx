import { useState, useEffect, useContext, createContext } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind'

const UserContext = createContext()

export const useLogin = () => useContext(UserContext)

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [loggedInData, setLoggedInData] = useState({})
    const [familyData, setFamilyData] = useState([])
    const [notifications, setNotifications] = useState(true)
    const [theme, setTheme] = useState(true)

    const { setColorScheme } = useColorScheme()

    useEffect(() => {
        const loadData = async () => {
            try {
                // User
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsLoggedIn(true);
                }

                // Notifications
                const storedNotifications = await AsyncStorage.getItem('notifications');
                if (storedNotifications !== null) {
                    setNotifications(JSON.parse(storedNotifications));
                }

                // Theme
                const storedTheme = await AsyncStorage.getItem('theme');
                if (storedTheme) {
                    setAppTheme(storedTheme)
                } else {
                    setAppTheme('a')
                }

                } catch (error) {
                    console.log('Failed to load data', error);
                }
            }

        loadData()
    }, [])

    const toggleNotifications = async (value) => {
        setNotifications(value)
        try {
            await AsyncStorage.setItem('notifications', JSON.stringify(value))
        } catch (error) {
            console.log('Failed to save notifications', error);
        }
    };

    const setAppTheme = async (value) => {
        setTheme(value)
        if (value === 'l') {
            setColorScheme('light')
        } else if (value === 'd') {
            setColorScheme('dark')
        } else {
            setColorScheme('system')
        }
        try {
            await AsyncStorage.setItem('theme', value);
        } catch (error) {
            console.log('Failed to save theme', error);
        }
    };

    const login = async (userData) => {
        console.log("in context's login.")
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData)
            setIsLoggedIn(true)
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
        <UserContext.Provider
            value={{ user, setUser, isLoggedIn, loggedInData, familyData, setFamilyData, setLoggedInData,
            login, logout, isLoggingOut, setIsLoggingOut, notifications, toggleNotifications, theme, setAppTheme}}
        >
            {children}
        </UserContext.Provider>
    )
}