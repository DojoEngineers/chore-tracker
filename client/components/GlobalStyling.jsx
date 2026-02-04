import { Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const GlobalStyling = ({ children }) => {
    const colorScheme = useColorScheme()

    // Only apply bottom edge on Android
    const edges = Platform.OS === 'android' ? ['bottom'] : []

    return (
        <SafeAreaView
            className={`${colorScheme === 'dark' ? 'dark' : ''} flex-1`}
            edges={edges}
        >
            {children}
        </SafeAreaView>
    )
}