import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, ScrollView, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial1Photo } from "../../components/Tutorial1Photo"
import { Frame1Icon } from "../../components/icons/Frame1Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BrandText } from "../../components/text/BrandText"
import { useLogin } from "../../context/UserContext"
import Toast from "react-native-toast-message"
import { updateUser } from "../../services/user.service"
import { useState } from "react"

export const TutorialPage1 = () => {

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
                Toast.show({type: 'error', text1: "Unable to update user."})
            })
    }

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg items-center">
            
            <Tutorial1Photo width={screenWidth} />

            <ScrollView
                contentContainerClassName="flex-grow justify-between"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <View className="mt-4">
                        <Frame1Icon />
                    </View>

                    <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-[5%]">
                        {loggedInData.isParent ? "Assign" : "Take before photo"}
                    </BrandBoldText>

                    {apiErrors.updateUser && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.updateUser}
                        </BrandText>
                    )}

                    <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px] px-[16px]">
                        {loggedInData.isParent
                            ? "Easily assign chores to your kids! Create one-time or recurring tasks, set due dates, add notes, " +
                            "and assign them to one or more kids in just a few taps. Update, delete or reassign chores anytime when plans change."

                            : `Snap a quick before photo of your chore. This shows what needs to be done and makes it easy to see your progress later!`
                        }
                    </BrandBoldText>
                </View>

                <View className="w-full">
                    <View className="px-[16px] w-full my-[5%] items-center">
                        <PrimaryButton onPress={() => navigation.navigate('TutorialPage2')} label="Continue" />
                        
                        <Pressable
                            onPress={handleSkip}
                            className="mt-[8%]"
                        >
                            <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[18px]">
                                Skip
                            </BrandText>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}