import { Pressable, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import Toast from "react-native-toast-message"
import { BrandText } from "../../components/text/BrandText"


export const DeleteAccount = () => {

    const [ apiErrors, setApiErrors ] = useState({})

    const {logout} = useLogin()
    const navigation = useNavigation()

    handleSubmit = () => {
        updateUser({isActive: false})
            .then( () => { 
                Toast.show({
                    type: 'success',
                    text1: "Profile successfully deleted!"
                })
                logout()
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'StartingPage', params: {animationType: "swipe_from_left"}}]
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
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">
            <View className="flex-row mt-[100px] items-center ps-2 mb-4">
                <Pressable
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow/>
                </Pressable>
                
                <BrandBoldText className="text-[36px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[41px] ml-8">
                    Delete Account
                </BrandBoldText>

                <View className="items-center mb-6 px-2">
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                        WARNING! Are you sure you want to delete your account? This cannot be undone.
                    </BrandText>
                </View>

                {apiErrors.updateUser && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.updateUser}
                    </BrandText>
                )}

                <View>
                    <PrimaryButton onPress={handleSubmit} label="Delete Account" />
                </View>

            </View>
        </View>
    )
}