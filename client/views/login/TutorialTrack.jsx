import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial2Photo } from "../../components/Tutorial2Photo"
import { Frame2Icon } from "../../components/icons/Frame2Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLeftSquiggle } from "../../components/squiggles/BottomLeftSquiggle"
import { BrandText } from "../../components/text/BrandText"
import LightBackArrow from "../../assets/icons/LightBackArrow"

export const TutorialTrack = () => {

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
                    Track
                </BrandBoldText>

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                    Track their progress.
                </BrandBoldText>
            </View>

            <View className="relative w-full">
                <View className="absolute bottom-0 left-0 z-0">
                    <BottomLeftSquiggle/>
                </View>

                <View className="px-[16px] w-full mb-[75px] items-center">
                    <PrimaryButton onPress={() => navigation.navigate('TutorialResults')} label="Continue" />
                    
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