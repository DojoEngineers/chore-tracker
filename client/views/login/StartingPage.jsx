import { useNavigation } from "@react-navigation/native"
import { View, Pressable } from "react-native"
import { BrandBoldText } from '../../components/text/BrandBoldText'
import { BrandText } from '../../components/text/BrandText'
import { LogoTopSquiggle } from "../../components/squiggles/LogoTopSquiggle"
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle"

export const StartingPage = () => {

    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

            <View>
                <LogoTopSquiggle />
            </View>

            <View className="items-center px-10">
                <BrandBoldText className="text-5xl text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                    Chore Tracking App
                </BrandBoldText>
            </View>

            <View className="items-center px-10">
                <Pressable
                    className="px-4 py-4 mx-10 mb-8 rounded-full items-center justify-center bg-[#84A99D] w-full"
                    onPress={() => navigation.navigate('Login')}
                >
                    <BrandBoldText className="text-white text-xl">Login</BrandBoldText>
                </Pressable>

                <Pressable
                    className="px-4 py-4 rounded-full items-center justify-center bg-[#455C56] w-full"
                    onPress={() => navigation.navigate('ParentRegistration')}
                    >
                    <BrandBoldText className="text-white text-xl">Start a family account</BrandBoldText>
                </Pressable>
            </View>

            <View>
                <View className="flex-row px-10 justify-center">
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Added by a parent? </BrandText>
                    <Pressable onPress={() => navigation.navigate('UsernameVerification')}>
                        <BrandBoldText className="text-lightLink dark:text-darkLink text-xl">Verify Here</BrandBoldText>
                    </Pressable>
                </View>
                <View className="items-end">
                    <LogoBottomSquiggle/>
                </View>
            </View>

        </View>
    )
}