import { useNavigation } from "@react-navigation/native"
import { useLogin } from "../../context/UserContext"
import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useState } from "react"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { UserInput } from "../../components/UserInput"
import { CloseIcon } from "../../components/icons/CloseIcon"
import { BrandText } from "../../components/text/BrandText"

const DEFAULT_FORM_VALUES = {
    details: ""
}

export const NewChoreDetails = ({route}) => {

    const [ apiErrors, setApiErrors ] = useState({})
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)
    const [formErrors, setFormErrors] = useState({})
    
    const {title} = route.params
    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            details: value => (
                value.length < 5 ? "Details must be at least 5 characters."
                : value.length > 250 ? "Details cannot exceed 250 characters."
                : false
            )
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    // Check for errors before submitting form
    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || formData[key] == "") {
                return false
            }
        }
        return true
    }

    // Submit form
    const handleSubmit = () => {
        if (!isReadyToSubmit()){
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >
                <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">

                    <View className="flex-row w-full mt-[100px] items-center mb-8">
                        <Pressable
                            className="ps-6 pe-8"
                            onPress={() => navigation.navigate("ParentDashboard")}
                        >
                            <CloseIcon />
                        </Pressable>
                        <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                            New Chore
                        </BrandBoldText>
                    </View>

                    <View>
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-2 my-5"
                        >
                            Notes
                        </BrandText>

                        <UserInput
                            value={formData.details}
                            onChangeText={(text) => handleChange('details', text)}
                            placeholder="Add notes"
                            error={formErrors.details}
                        />
                    </View>

                    <View className="flex-row justify-between items-center">
                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                            Assign to
                        </BrandText>
                        
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}