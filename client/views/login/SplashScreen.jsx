import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View } from "react-native";
import { BrandBoldText } from '../../components/BrandBoldText'

export const SplashScreen = () => {

    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('StartingPage')
        }, 2000)
    return () => clearTimeout(timer)
    }, [])

    return (
        <View className="flex-1 justify-center items-center bg-lightBg dark:bg-darkBg">
            <BrandBoldText className="text-7xl text-lightPrimaryText dark:text-darkPrimaryText">Logo</BrandBoldText>
        </View>
    )
}