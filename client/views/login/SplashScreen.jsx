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
            navigation.replace('StartingPage', {animationType: "fade"})
        }, 2000)
    return () => clearTimeout(timer)
    }, [])

    return (
        <View className="flex-1 justify-between bg-lightBg dark:bg-darkBg">
            <LogoTopSquiggle/>

            <View className="items-center p-16">
                <BrandBoldText className="text-7xl text-lightPrimaryText dark:text-darkPrimaryText leading-[80px]">
                    Logo
                </BrandBoldText>
            </View>

            <View className="items-end">
                <LogoBottomSquiggle/>
            </View>

        </View>
    )
}