import { useState, useRef, useEffect, useContext, createContext } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Linking, Platform } from "react-native";
import { updateUser } from "../services/user.service";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const UserContext = createContext()

export const useLogin = () => useContext(UserContext)

export const useNotifications = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const UserContextProvider = ({ children }) => {

    const BACKEND_API_URL = Constants.expoConfig.extra.BACKEND_API_URL
    const projectId = Constants.expoConfig.extra.eas.projectId

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [loggedInData, setLoggedInData] = useState({})
    const [familyData, setFamilyData] = useState([])
    const [notifications, setNotifications] = useState(true)
    const [theme, setTheme] = useState(true)
    const [firstMount, setFirstMount] = useState(true)
    // dashboard only saves push token when the user first logs in (on first mount of the dashboard page).

    const { setColorScheme } = useColorScheme()

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();

    // called after logging in and entering dashboard. registers for push, gets token and saves it to user doc.
    const registerForPushNotifications = async () => {
        try {
            // Android notification channel setup
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            if (!Device.isDevice) {
                Alert.alert('Error', 'Must use physical device for push notifications');
                return null;
            }

            // Check permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Permission denied',
                    'Notifications are disabled. Please enable them in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                )
                // save notification settings to state and async storage
                try {
                    await AsyncStorage.setItem('notifications', JSON.stringify(false))
                } catch (error) {
                    console.log('Failed to save notifications', error)
                }
                setNotifications(false)
                return null;
            }

            // Get project ID

            if (!projectId) {
                console.error('Project ID not found in config')
                return null;
            }

            // Get push token
            const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('📱 Expo Push Token:', token);

            // save notification settings to state and async storage
            setNotifications(true)
            try {
                await AsyncStorage.setItem('notifications', JSON.stringify(true))
            } catch (error) {
                console.log('Failed to save notifications', error)
            }

            // save token to backend
            setExpoPushToken(token)
            if (token && loggedInData._id) {
                await updateUser({ pushToken: token })
                return token
            }
            else {
                console.warn('No token or user ID; push token not saved')
            }
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    };

    // pings backend to send push.
    const sendPush = async (id, token, title, body, data = {}) => {
        if (!token) {
            console.warn("No push token provided!")
            return;
        }
        try {
            const response = await fetch(`${BACKEND_API_URL}/send-push/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id, token, title, body
                }),
            });
            if (response.ok) {
                console.log("Push sent successfully:", { id, token, title, body })
                return { success: true }
            }
            else {
                console.warn("Push not sent, response not OK:", response.status)
                return { success: false, error: 'Response not ok' };
            }

        }
        catch (error) {
            console.error("Error sending push:", error);
            return { success: false };
        }
    }

    useEffect(()=> {
        // Prepares phone on mount to receive push:
        // Set up notification listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('📨 Notification received:', notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('👆 Notification tapped:', response);
        });
        // Cleanup
        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        }
    },[])

    // useEffect(()=>{
    //     if (notifications) {
    //         registerForPushNotifications()
    //     }
    // }, [notifications])

    useEffect(() => {
        const loadData = async () => {
            try {
                // User
                const storedUser = await AsyncStorage.getItem('user')
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsLoggedIn(true);
                }

                // Notifications
                const areNotificationsOn = await AsyncStorage.getItem('notifications')
                if (areNotificationsOn !== null) {
                    setNotifications(JSON.parse(areNotificationsOn))
                }

                // Theme
                const storedTheme = await AsyncStorage.getItem('theme')
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

    const toggleNotifications = async (isOn) => {
        setNotifications(isOn)
        try {
            await AsyncStorage.setItem('notifications', JSON.stringify(isOn))
            if (isOn) {
                if (!expoPushToken) {
                    await registerForPushNotifications()
                }
            }
            // else {
            //     if (expoPushToken && loggedInData?._id) {
            //         await updateUser({ removePushToken: expoPushToken })
            //     }
            //     setExpoPushToken(null)
            // }
        } catch (error) {
            console.log('Failed to save notifications', error)
        }
    }


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
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData)
            setIsLoggedIn(true)
            return userData
        } catch (e) {
            console.log('Failed to save user', e);
        }
    }

    const logout = async () => {
        try {
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
            value={{
                user, setUser, isLoggedIn, loggedInData, familyData, setFamilyData, setLoggedInData,
                login, logout, isLoggingOut, setIsLoggingOut, notifications, toggleNotifications,
                theme, setAppTheme, expoPushToken, sendPush, registerForPushNotifications, firstMount, setFirstMount
            }}
        >
            {children}
        </UserContext.Provider>
    )
}