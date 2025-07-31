import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View } from "react-native";
import { BrandBoldText } from '../../components/text/BrandBoldText'
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle";
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle";

export const SplashScreen = () => {

    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('StartingPage')
        }, 2000)
    return () => clearTimeout(timer)
    }, [])

    return (
        <View className="flex-1 justify-between bg-lightBg dark:bg-darkBg">

            <View>
                <LogoTopSquiggle/>
            </View>

            <View className="items-center">
                <BrandBoldText className="text-7xl text-lightPrimaryText dark:text-darkPrimaryText">
                    Logo
                </BrandBoldText>
            </View>

            <View className="items-end">
                <LogoBottomSquiggle/>
            </View>

        </View>
    )
}