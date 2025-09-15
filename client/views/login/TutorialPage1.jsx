import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial1Photo } from "../../components/Tutorial1Photo"
import { Frame1Icon } from "../../components/icons/Frame1Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BrandText } from "../../components/text/BrandText"
import { useLogin } from "../../context/UserContext"

export const TutorialPage1 = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const screenWidth = Dimensions.get('window').width

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg items-center justify-between">
            <View className="items-center">

                <Tutorial1Photo width={screenWidth} />

                <View className="mt-4">
                    <Frame1Icon />
                </View>

                <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-10">
                    {loggedInData.isParent ? "Assign" : "Take before photo"}
                </BrandBoldText>

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                    {loggedInData.isParent
                        ? "Easily assign chores to your kids."
                        : "Text goes here."
                    }
                </BrandBoldText>
            </View>

            <View className="w-full">
                <View className="px-[16px] w-full mb-[75px] items-center">
                    <PrimaryButton onPress={() => navigation.navigate('TutorialPage2')} label="Continue" />
                    
                    <Pressable
                        onPress={() => navigation.navigate('Dashboard')}
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