import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial3Photo } from "../../components/Tutorial3Photo"
import { Frame3Icon } from "../../components/icons/Frame3Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLeftSquiggle } from "../../components/squiggles/BottomLeftSquiggle"
import LightBackArrow from "../../assets/icons/LightBackArrow"

export const TutorialResults = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const screenWidth = Dimensions.get('window').width
    
    const handleSubmit = () => {
        if (loggedInData.isParent) {
            navigation.navigate('ParentDashboard')
        } else {
            navigation.navigate('KidDashboard')
        }
    }

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg items-center justify-between">
            <View className="items-center">

                <View className="relative">
                    <Tutorial3Photo width={screenWidth} />

                    <Pressable
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                        className="absolute top-20 left-8 z-10"
                    >
                        <LightBackArrow width={15} height={27}/>
                    </Pressable>
                </View>

                <View className="mt-4">
                    <Frame3Icon />
                </View>

                <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-10">
                    Results
                </BrandBoldText>

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                    Visible results.
                </BrandBoldText>
            </View>

            <View className="w-full">
                <View className="px-[16px] w-full mb-[125px] items-center">
                    <PrimaryButton onPress={handleSubmit} label="Continue" />
                </View>
            </View>
        </View>
    )
}