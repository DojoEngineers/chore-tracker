import { View, TextInput, useColorScheme, Pressable } from 'react-native';
import { BrandText } from './text/BrandText';
import { PasswordIcon } from './icons/PasswordIcon';
import { EyeIcon } from "./icons/EyeIcon"
import { useState } from 'react';


export const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
    error = false,
    }) => {

    const [secureTextEntry, setSecureTextEntry] = useState(true)

    // Text input placeholder color
    const colorScheme = useColorScheme();
    const placeholderColor = colorScheme === 'dark' ? '#FFFFFF' : '#737780';

    return (
        <View>
            {error && (
                <BrandText className="text-red-500 text-center">{error}</BrandText>
            )}
            <View className="dark:border dark:border-white dark:bg-transparent bg-white rounded-full shadow-md px-[16px] ps-[24px] flex-row items-center w-full h-[50px]">
                <PasswordIcon />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    secureTextEntry={secureTextEntry}
                    className="flex-1 ml-[16px] text-[15px] font-nunito dark:text-white text-lightSecondaryText"
                />
                <Pressable onPress={() => setSecureTextEntry(prev => !prev)} hitSlop={20}>
                    <EyeIcon />
                </Pressable>
            </View>
        </View>
    )
}