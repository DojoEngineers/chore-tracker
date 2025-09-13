import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial1Photo } from "../../components/Tutorial1Photo"
import { Frame1Icon } from "../../components/icons/Frame1Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLeftSquiggle } from "../../components/squiggles/BottomLeftSquiggle"
import { BrandText } from "../../components/text/BrandText"

export const TutorialAssign = () => {

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

                <Tutorial1Photo width={screenWidth} />

                <View className="mt-4">
                    <Frame1Icon />
                </View>

                <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-10">
                    Assign
                </BrandBoldText>

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                    Easily assign chores to your kids.
                </BrandBoldText>
            </View>

            <View className="w-full">
                <View className="px-[16px] w-full mb-[75px] items-center">
                    <PrimaryButton onPress={() => navigation.navigate('TutorialTrack')} label="Continue" />
                    
                    <Pressable
                        onPress={handleSubmit}
                        className="mt-8"
                    >
                        <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[18px]">
                            Skip
                        </BrandText>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}