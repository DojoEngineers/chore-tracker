import { useNavigation } from "@react-navigation/native"
import { View, Pressable } from "react-native"
import { BrandBoldText } from '../../components/BrandBoldText'

export const StartingPage = () => {

    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg items-center p-10">

            <BrandBoldText className="text-5xl text-center text-lightPrimaryText dark:text-darkPrimaryText mt-[150px] mb-[100px] leading-[45px]">
                Chore Tracking App
            </BrandBoldText>

            <Pressable
                className="px-4 py-4 mx-10 mb-8 rounded-full items-center justify-center bg-[#84A99D] dark:bg-[#84A99D] w-full"
                onPress={() => navigation.navigate('Login')}
            >
                <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Login</BrandBoldText>
            </Pressable>

            <Pressable
                className="px-4 py-4 rounded-full items-center justify-center bg-[#455C56] dark:bg-[#455C56] w-full"
                onPress={() => navigation.navigate('ChooseAccountType')}
            >
                <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-xl">Register</BrandBoldText>
            </Pressable>

        </View>
    )
}