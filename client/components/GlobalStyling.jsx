import { View } from 'react-native';
import { useColorScheme } from 'react-native';

export const GlobalStyling = ({ children }) => {
    const colorScheme = useColorScheme()

    return (
    // <></>
        <View className={`${colorScheme === 'dark' ? 'dark' : ''} flex-1`}>
            {children}
        </View>
    )
}