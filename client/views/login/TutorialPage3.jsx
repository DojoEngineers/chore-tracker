import { useNavigation } from "@react-navigation/native"
import { Dimensions, Pressable, ScrollView, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Tutorial3Photo } from "../../components/Tutorial3Photo"
import { Frame3Icon } from "../../components/icons/Frame3Icon"
import { PrimaryButton } from "../../components/PrimaryButton"
import LightBackArrow from "../../assets/icons/LightBackArrow"
import { useLogin } from "../../context/UserContext"
import { updateUser } from "../../services/user.service"
import { useState } from "react"
import Toast from "react-native-toast-message"

export const TutorialPage3 = () => {

    const [apiErrors, setApiErrors] = useState({})
    const navigation = useNavigation()
    const {loggedInData} = useLogin()
    const screenWidth = Dimensions.get('window').width

    const handleContinue = () => {
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

            <ScrollView
                contentContainerClassName="flex-grow justify-between"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <View className="mt-4">
                        <Frame3Icon />
                    </View>

                    <BrandBoldText className="text-[30px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] my-[5%]">
                        {loggedInData.isParent ? "Results" : "Take after photo"}
                    </BrandBoldText>

                    {apiErrors.updateUser && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.updateUser}
                        </BrandText>
                    )}

                    <BrandBoldText className="text-center text-lightPrimaryText dark:text-darkPrimaryText text-[18px] px-[16px]">
                        {loggedInData.isParent
                            ? "Quickly approve completed chores with just a tap! Save time while keeping your kids on track, " +
                            "and see all their hard work at a glance. Turn completed chores into visible wins your family can be proud of!"

                            : "Take an after photo to show off your hard work. You can also view your completed chores anytime in the Completed tab. " +
                            "See the difference you made and celebrate your success!"
                        }
                    </BrandBoldText>
                </View>

                <View className="w-full">
                    <View className="px-[16px] w-full my-[5%] items-center">
                        <PrimaryButton onPress={handleContinue} label="Continue" />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}