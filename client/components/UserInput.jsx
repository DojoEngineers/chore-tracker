import { View, TextInput, useColorScheme } from 'react-native';
import { BrandText } from './text/BrandText';


export const UserInput = ({
    icon: Icon,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry = false
    }) => {

        // Text input placeholder color
        const colorScheme = useColorScheme();
        const placeholderColor = colorScheme === 'dark' ? '#FFFFFF' : '#737780';

    return (
        <View>
            {error && (
                <BrandText className="text-red-500 text-center">{error}</BrandText>
            )}
            <View className="dark:border dark:border-white dark:bg-transparent bg-white rounded-full shadow-md px-[16px] ps-[24px] flex-row items-center w-full h-[50px]">
                {Icon && <Icon />}
                <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                secureTextEntry={secureTextEntry}
                className="flex-1 ml-[16px] text-[15px] font-nunito dark:text-white text-lightSecondaryText"
                />
            </View>
        </View>
    )
}