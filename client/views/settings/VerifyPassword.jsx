import { Keyboard, Modal, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { useNavigation } from "@react-navigation/native"
import { updateUser, verifyPassword } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { useState } from "react"
import { useLogin } from "../../context/UserContext"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { BottomLink } from "../../components/BottomLink"
import { PasswordInput } from "../../components/PasswordInput"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"
import { CloseIcon } from "../../components/icons/CloseIcon"

export const VerifyPassword = ({route}) => {

    const [password, setPassword] = useState()
    const [ apiErrors, setApiErrors ] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const navigation = useNavigation()
    const {loggedInData, logout} = useLogin()
    const {deleteAccount = false} = route.params

    const handleSubmit = () => {
        const username = loggedInData.username
        verifyPassword({username, password})
            .then(res => {
                if (res) {
                    if (deleteAccount) {
                        setModalVisible(true)
                    }
                    else {
                        navigation.navigate("SetPassword", {username})
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: "Incorrect password."
                    })
                }
            })
            .catch(error => {
                console.log("verifyPassword error:", error)
                setApiErrors(prev => ({...prev, verifyPassword: "Unable to verify password."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to verify password."
                })
            })
    }

    const handleDelete = () => {
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View className="px-[16px]">
                    <View className="flex-row ps-2 mt-[75px] mb-10 items-center">
                        <Pressable
                            hitSlop={20}
                            onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                        >
                            <BackArrow/>
                        </Pressable>

                        <BrandBoldText className="text-[30px] text-lightPrimaryText dark:text-darkPrimaryText leading-[35px] ps-6">
                            Verify Password
                        </BrandBoldText>
                    </View>

                    <View className="items-center mb-6 px-2">
                        <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px] text-center">
                            {deleteAccount
                            ?
                                "Password verification is required before deleting your account.\n WARNING! This cannot be undone."
                            :
                                "To change your password, enter your current password below."
                            }
                        </BrandText>
                    </View>

                    {apiErrors.verifyPassword && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.verifyPassword}
                        </BrandText>
                    )}

                    {apiErrors.updateUser && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.updateUser}
                        </BrandText>
                    )}

                    <View className="mb-[75px]">
                        <PasswordInput
                            value={password}
                            placeholder="Password"
                            onChangeText={setPassword}
                        />
                    </View>

                    <View>
                        <PrimaryButton onPress={handleSubmit} label="Submit" />
                    </View>
                </View>

                <View className="relative w-full">
                    <View className="absolute bottom-0 right-0 z-0">
                        <SmallBottomRightSquiggle/>
                    </View>

                    <View className="flex-row mb-[80px] justify-center">
                        <BottomLink onPress={() => navigation.navigate('ForgotPassword')} text="Forgot Password? " link="Reset Now" />
                    </View>
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        className="flex-1 justify-center items-center"
                        style={{backgroundColor:  'rgba(68, 73, 85, 0.5)'}}
                    >
                        <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[250px]">
                            <View className="flex-row items-center">
                                <Pressable
                                    hitSlop={20}
                                    className="pe-4 me-6"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <CloseIcon />
                                </Pressable>

                                <BrandBoldText className="dark:text-darkPrimaryText text-[#111215] text-[16px]">
                                    Confirm Delete
                                </BrandBoldText>
                            </View>
    
                            <BrandText className="dark:text-darkPrimaryText text-[#111215] text-[16px] my-4">
                                Are you sure you want to delete your account?
                            </BrandText>
    
                            <Pressable
                                className="p-[10px] items-center justify-center bg-[#F40000] rounded-full w-full"
                                onPress={handleDelete}
                            >
                                <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                    Delete
                                </BrandBoldText>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    )
}