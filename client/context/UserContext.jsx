import { useState, useRef, useEffect, useContext, createContext } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from "react-native";

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

    const BACKEND_API_URL = "http://192.168.1.217:8000"
    // Constants.expoConfig.extra.BACKEND_API_URL
    const projectId = "83482397-4c35-430c-916b-2ac4f6d4263e"
    // Constants.expoConfig.extra.eas.projectId

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [loggedInData, setLoggedInData] = useState({})
    const [familyData, setFamilyData] = useState([])
    const [notifications, setNotifications] = useState(true)
    const [theme, setTheme] = useState(true)

    const { setColorScheme } = useColorScheme()

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const notificationListener = useRef();
    const responseListener = useRef();

    // useEffect(() => {
    //     // Register for push notifications on app start
    //     registerForPushNotifications().then(token => {
    //         setExpoPushToken(token || '');
    //     });

    //     // Listen for incoming notifications
    //     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //         console.log('📨 Notification received:', notification);
    //         setNotification(notification);
    //     });

    //     // Listen for notification interactions (taps)
    //     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //         console.log('👆 Notification tapped:', response);
    //         // Handle notification tap - navigate to specific screen, etc.
    //     });

    //     return () => {
    //         if (notificationListener.current) {
    //             Notifications.removeNotificationSubscription(notificationListener.current);
    //         }
    //         if (responseListener.current) {
    //             Notifications.removeNotificationSubscription(responseListener.current);
    //         }
    //     };
    // }, []);


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
                Alert.alert('Error', 'Must use physical device for Push Notifications');
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
                Alert.alert('Permission denied', 'Failed to get push token for notifications!');
                return null;
            }

            // Get project ID
            // const projectId = "f9970bf3-a09a-463b-b37d-40622414d40e"
            // Constants?.expoConfig?.eas?.projectId ?? Constants?.easConfig?.projectId;

            if (!projectId) {
                Alert.alert('Error', 'Project ID not found in config');
                return null;
            }

            // Get push token
            const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('📱 Expo Push Token:', token);
            Alert.alert('token', token);

            // TODO: Send token to your backend
            // await sendTokenToBackend(token);

            return token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            Alert.alert('Error', `Failed to register for push: ${error}`);
            return null;
        }
    };

    // Send notification via Expo's push service
    const sendPushNotification = async (token, title, body, data = {}) => {
        if (!token) {
            Alert.alert('Error', 'No push token available');
            return;
        }

        const message = {
            to: token,
            sound: 'default',
            title,
            body,
            data,
        };

        try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Notification sent successfully:', result);
                return { success: true, result };
            } else {
                console.error('❌ Failed to send notification:', result);
                return { success: false, error: result };
            }
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            Alert.alert('Error', 'Failed to send notification');
            return { success: false, error };
        }
    };

    // pings backend to send push.
    const sendTestPush = async (token, title, body, data={}) => {
        if (!token) {
            Alert.alert('Error', 'No push token available');
            return;
        }
        try {
            const response = await fetch(`${BACKEND_API_URL}/send-push/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token, title, body
                }),
            });
            if (response.ok) {
                Alert.alert("Sent!")
                return { success: true }
            }

        }
        catch (error) {
            Alert.alert('Catch Error', error.message || 'Unknown error');
            return { success: false };
        }
    }


    // const sendTestNotification = async () => {
    //     if (!expoPushToken) {
    //         Alert.alert('Error', 'No push token available');
    //         return;
    //     }

    //     return await sendPushNotification(
    //         expoPushToken,
    //         'Test Notification! 🎉',
    //         'This is a test from your app!',
    //         {
    //             screen: 'ChoreList',
    //             testData: true
    //         }
    //     );
    // };

    useEffect(() => {
        // Initialize notifications on mount
        const initializeNotifications = async () => {
            setIsLoading(true);
            const token = await registerForPushNotifications();
            setExpoPushToken(token || '');
            setIsLoading(false);
        };

        initializeNotifications();

        // Set up notification listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('📨 Notification received:', notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('👆 Notification tapped:', response);

            // Handle notification tap - navigate to specific screen
            const data = response.notification.request.content.data;
            if (data?.screen) {
                // TODO: Navigate to specific screen
                console.log('Navigate to:', data.screen);
            }
        });
        // Cleanup
        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

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
                login, logout, isLoggingOut, setIsLoggingOut, notifications, toggleNotifications, theme, setAppTheme, sendTestPush
            }}
        >
            {children}
        </UserContext.Provider>
    )
}