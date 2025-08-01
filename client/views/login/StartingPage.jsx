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

            <View className="items-center px-[16px]">
                <BrandBoldText className="text-[40px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                    Chore Tracking App
                </BrandBoldText>
            </View>

            <View className="items-center px-[16px]">
                <Pressable
                    className="p-[10px] mb-6 rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px]"
                    onPress={() => navigation.navigate('Login')}
                >
                    <BrandBoldText className="text-white text-[20px]">Login</BrandBoldText>
                </Pressable>

                <Pressable
                    className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px]"
                    onPress={() => navigation.navigate('ParentRegistration')}
                    >
                    <BrandBoldText className="text-white text-[20px]">Start a family account</BrandBoldText>
                </Pressable>
            </View>

            <View>
                <View className="flex-row px-[16px] justify-center">
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