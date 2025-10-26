import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { UserInput } from "../../components/UserInput"
import { FirstNameIcon } from "../../components/icons/FirstNameIcon"
import { EmailIcon } from "../../components/icons/EmailIcon"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { checkUsername, register } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useLogin } from "../../context/UserContext"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"

const DEFAULT_FORM_VALUES = {
    name: "",
    username: ""
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_EMOJI_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}]*$/u

export const AddFamilyMember = ({route}) => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()
    const { isParent } = route.params
    const {loggedInData, setLoggedInData} = useLogin()

    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    const validateData = (name, value) => {
        const validations = {
            name: value => (
                value.length < 2 ? "Name must be at least 2 characters long."
                : !NO_EMOJI_REGEX.test(value) ? "Name must not contain emojis."
                : false
            ),
            username: value => (
                !EMAIL_REGEX.test(value)
                ? "Username must be a valid email."
                : !NO_EMOJI_REGEX.test(value) ? "Username must not contain emojis."
                : false
            )
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || formData[key] == "") {
                return false
            }
        }
        return true
    }

    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
        const { name } = formData
        const username = formData.username.toLowerCase()
        checkUsername(username)
            .then((res) => {
                if (res) {
                    Toast.show({
                        type: 'error',
                        text1: "Username already exists."
                    })
                } else {
                    register({name, username, isParent, family: loggedInData.family})
                        .then( (res) => { 
                            Toast.show({
                                type: 'success',
                                text1: "Account created successfully!"
                            })
                            setLoggedInData(prev => {
                                const currentFamily = prev.family || { parents: [], children: [] }
                                if (isParent) {
                                    return {...prev, family: {...currentFamily, parents: [...currentFamily.parents, res.user]}}
                                } else {
                                    return {...prev, family: {...currentFamily, children: [...currentFamily.children, res.user]}}
                                }
                            })
                            navigation.navigate('Dashboard', {animationType: "slide_from_left"})
                        })
                        .catch( error => {
                            console.log("register error:", error)
                            setApiErrors(prev => ({...prev, register: "Unable to create account."}))
                            Toast.show({
                                type: 'error',
                                text1: "Unable to create account."
                            })
                        })
                }
            })
            .catch(error => {
                console.log("checkUsername error:", error)
                setApiErrors(prev => ({...prev, checkUsername: "Unable to validate username."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to validate username."
                })
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
                <View className="px-[16px]">
                    <View className="flex-row mt-[75px]">
                        <Pressable
                            className="pt-4 ps-2"
                            hitSlop={20}
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow/>
                        </Pressable>

                        <View className="flex-1 mb-10 ms-[34px]">
                            <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                                Add a {isParent ? "parent" : "kid"}
                            </BrandBoldText>
                        </View>
                    </View>

                    {apiErrors.register && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.register}
                        </BrandText>
                    )}
                    {apiErrors.checkUsername && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.checkUsername}
                        </BrandText>
                    )}

                    <View className="items-center mb-12">
                        <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                            After adding a {isParent ? "parent" : "kid"}, they will get an email with a verification code.
                            They can use the ‘Verify’ link on our home page to enter the code and create their account.
                        </BrandText>
                    </View>

                    <View className="mb-10">
                        <UserInput
                            icon={FirstNameIcon}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="First name"
                            error={formErrors.name}
                        />
                    </View>

                    <View className="mb-[60px]">
                        <UserInput
                            icon={EmailIcon}
                            value={formData.username}
                            onChangeText={(text) => handleChange('username', text)}
                            placeholder="Email"
                            error={formErrors.username}
                        />
                    </View>

                    <PrimaryButton onPress={handleSubmit} label="Submit"/>
                </View>

                <View className="items-end">
                    <SmallBottomRightSquiggle />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}