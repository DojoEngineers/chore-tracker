import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial2Photo } from "../../components/Tutorial2Photo"
import { Frame2Icon } from "../../components/icons/Frame2Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BrandText } from "../../components/text/BrandText"
import LightBackArrow from "../../assets/icons/LightBackArrow"
import { useLogin } from "../../context/UserContext"
import Toast from "react-native-toast-message"
import { updateUser } from "../../services/user.service"
import { useState } from "react"

export const TutorialPage2 = () => {

    const [apiErrors, setApiErrors] = useState({})
    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const screenWidth = Dimensions.get('window').width

    const handleSkip = () => {
        updateUser({id: loggedInData._id, firstLogin: false})
            .then( () => { 
                navigation.replace("Dashboard")
            })
            .catch( error => {
                console.log("updateUser error:", error)
                setApiErrors(prev => ({...prev, updateUser: "Unable to update user."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to update user."
                })
            })
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
                    {loggedInData.isParent ? "Track" : "Complete chore"}
                </BrandBoldText>

                {apiErrors.updateUser && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.updateUser}
                    </BrandText>
                )}

                <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px] px-[16px]">
                    {loggedInData.isParent
                        ? "View tasks by due date with an interactive calendar, instantly see what’s due in the Today tab, " +
                        "and view chores by kid in the Kids tab to stay organized. " +
                        "Review completed chores in the Approve tab. No more guessing or hunting for updates!"

                        : "Complete your chore! Check what’s due this week in the This Week tab or use the interactive " +
                        "calendar in the dashboard to stay on track."
                    }
                </BrandBoldText>
            </View>

            <View className="w-full">
                <View className="px-[16px] w-full mb-[75px] items-center">
                    <PrimaryButton onPress={() => navigation.navigate('TutorialPage3')} label="Continue" />
                    
                    <Pressable
                        onPress={handleSkip}
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