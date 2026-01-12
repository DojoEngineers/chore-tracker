import { useColorScheme } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export const GlobalStyling = ({ children }) => {
    const colorScheme = useColorScheme()

    return (
        <SafeAreaView
            className={`${colorScheme === 'dark' ? 'dark' : ''} flex-1`}
            edges={['bottom']}
        >
            {children}
        </SafeAreaView>
    )
}