import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View } from "react-native";
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle";
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle";
import { AppLogo } from "../../components/icons/AppLogo";

export const SplashScreen = () => {

    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('StartingPage', {animationType: "fade"})
        }, 2000)
    return () => clearTimeout(timer)
    }, [])

    return (
        <View className="flex-1 justify-between bg-lightBg dark:bg-darkBg">
            <LogoTopSquiggle/>

            <View className="items-center">
                <AppLogo />
            </View>

            <View className="items-end">
                <LogoBottomSquiggle/>
            </View>

        </View>
    )
}