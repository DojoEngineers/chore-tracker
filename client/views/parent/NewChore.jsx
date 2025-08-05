import { Keyboard, Pressable, TouchableWithoutFeedback, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import {CloseIcon} from "../../components/icons/CloseIcon"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { UserInput } from "../../components/UserInput"
import { PrimaryButton } from "../../components/PrimaryButton"
import Toast from "react-native-toast-message"


export const NewChore = () => {

    const [selected, setSelected] = useState('preset')
    const [title, setTitle] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()

    // Dynamically set form data
    const handleChange = (name, value) => {
        setTitle(value)
        validateData(name, value)
    }

    // Validate form inputs dynamically
    const validateData = (name, value) => {
        const validations = {
            title: value => (
                value.length < 5 ? "Description must be at least 5 characters."
                : value.length > 30 ? "Description cannot exceed 30 characters."
                : false
            ),
        }
        setFormErrors(prev => ({...prev, [name]: validations[name](value)}))
    }

    // Check for errors before submitting form
    const isReadyToSubmit = () => {
        for (let key in formErrors){
            if (formErrors[key] != false || title == "") {
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
        }
        else {
            navigation.navigate("NewChoreDetails", {title})
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

                    <View className="flex-row items-center justify-evenly">
                        <Pressable
                            onPress={() => setSelected('preset')}
                            className={`p-[10px] rounded-full items-center justify-center w-[156px] h-[38px] ${
                                selected === 'preset'
                                    ? 'dark:bg-[#B3EAD3] bg-[#B4684E]'
                                    : 'dark:bg-[#444955] bg-[#DFAE9D]'
                            }`}
                        >
                            <BrandBoldText className={selected === 'preset' ? 'text-white dark:text-black text-[16px]' : 'text-white text-[16px]'}>
                                Preset
                            </BrandBoldText>
                        </Pressable>

                        <Pressable
                            onPress={() => setSelected('personalized')}
                            className={`p-[10px] rounded-full items-center justify-center w-[156px] h-[38px] ${
                                selected === 'personalized'
                                    ? 'dark:bg-[#B3EAD3] bg-[#B4684E]'
                                    : 'dark:bg-[#444955] bg-[#DFAE9D]'
                            }`}
                        >
                            <BrandBoldText className={selected === 'personalized' ? 'text-white dark:text-black text-[16px]' : 'text-black dark:text-white text-[16px]'}>
                                Personalized
                            </BrandBoldText>
                        </Pressable>
                    </View>

                    {selected === 'personalized'
                        ?
                            <View>
                                <BrandBoldText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-2 my-5"
                                >
                                    Add Chore
                                </BrandBoldText>

                                <UserInput
                                    value={title}
                                    onChangeText={(text) => handleChange('title', text)}
                                    placeholder="Add personalized chore"
                                    error={formErrors.title}
                                />

                                <View className="mt-8">
                                    <PrimaryButton onPress={handleSubmit} label="Next"/>
                                </View>
                            </View>
                        :
                            <View>

                            </View>
                    }

                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}