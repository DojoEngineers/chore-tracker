import { Pressable, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import Toast from "react-native-toast-message"
import { BrandText } from "../../components/text/BrandText"
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle"
import { updateUser } from "../../services/user.service"


export const DeleteAccount = () => {

    const [ apiErrors, setApiErrors ] = useState({})

    const {logout} = useLogin()
    const navigation = useNavigation()

    const handleSubmit = () => {
        updateUser({isActive: false})
            .then( () => { 
                Toast.show({
                    type: 'success',
                    text1: "Account successfully deleted!"
                })
                logout()
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'StartingPage', params: {animationType: "slide_from_left"}}]
                })
            })
            .catch( error => {
                console.log("updateUser error:", error)
                setApiErrors(prev => ({...prev, updateUser: "Unable to delete account."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to delete account."
                })
            })
    }

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
            <View className="px-[16px]">
                <View className="flex-row mt-[150px] mb-[60px] items-center ps-2">
                    <Pressable
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow/>
                    </Pressable>
                
                    <BrandBoldText className="text-[36px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[41px] ml-8">
                        Delete Account
                    </BrandBoldText>
                </View>

                <View className="items-center mb-[60px] px-2">
                    <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center">
                        WARNING!{"\n"}{"\n"}Are you sure you want to delete your account?{"\n"}{"\n"}This cannot be undone.
                    </BrandBoldText>
                </View>

                {apiErrors.updateUser && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.updateUser}
                    </BrandText>
                )}

                <View>
                    <Pressable
                        onPress={handleSubmit}
                        className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px]"
                    >
                        <BrandBoldText className="text-white text-[20px]">
                            Delete account
                        </BrandBoldText>
                    </Pressable>
                </View>
            </View>

            <View className="items-end">
                <LogoBottomSquiggle />
            </View>
        </View>
    )
}