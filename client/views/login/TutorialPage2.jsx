import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial2Photo } from "../../components/Tutorial2Photo"
import { Frame2Icon } from "../../components/icons/Frame2Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BrandText } from "../../components/text/BrandText"
import LightBackArrow from "../../assets/icons/LightBackArrow"
import { useLogin } from "../../context/UserContext"

export const TutorialPage2 = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const screenWidth = Dimensions.get('window').width

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg items-center justify-between">
            <View className="items-center">

                <View className="relative">
                    <Tutorial2Photo width={screenWidth} />

                    <Pressable
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                        className="absolute top-20 left-8 z-10"
                    >
                        <LightBackArrow width={15} height={27}/>
                    </Pressable>
                </View>

                <View className="mt-4">
                    <Frame2Icon />
                </View>

                <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-10">
                    {loggedInData.isParent ? "Track" : "Complete chore"}
                </BrandBoldText>

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                    {loggedInData.isParent
                        ? "Track their progress."
                        : "Text goes here."
                    }
                </BrandBoldText>
            </View>

            <View className="w-full">
                <View className="px-[16px] w-full mb-[75px] items-center">
                    <PrimaryButton onPress={() => navigation.navigate('TutorialPage3')} label="Continue" />
                    
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