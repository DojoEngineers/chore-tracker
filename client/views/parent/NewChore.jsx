import { Keyboard, Pressable, ScrollView, TouchableWithoutFeedback, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import {CloseIcon} from "../../components/icons/CloseIcon"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { UserInput } from "../../components/UserInput"
import { PrimaryButton } from "../../components/PrimaryButton"
import Toast from "react-native-toast-message"
import { BrandText } from "../../components/text/BrandText"
import { PresetChoreButton } from "../../components/PresetChoreButton"


export const NewChore = () => {

    const [selected, setSelected] = useState('custom')
    const [title, setTitle] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()

    // Dynamically set form data
    const handleChange = (value) => {
        setTitle(value)
        if (value.length < 3) {
            setFormErrors(prev => ({...prev, title: "Title must be at least 3 characters."}))
        }
        else if (value.length > 30) {
            setFormErrors(prev => ({...prev, title: "Title cannot exceed 30 characters."}))
        }
        else {
            setFormErrors(prev => ({...prev, title: false}))
        }
    }

    const handleSubmit = () => {
        if (!title || formErrors.title){
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
            <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">

                <View className="flex-row w-full mt-[50px] items-center mb-8">
                    <Pressable
                        hitSlop={20}
                        className="ps-2 pe-8"
                        onPress={() => navigation.replace("ParentDashboard", {animationType: "fade_from_bottom"})}
                    >
                        <CloseIcon />
                    </Pressable>
                    <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                        New Chore
                    </BrandBoldText>
                </View>

                <View className="flex-row mb-6 gap-5">
                    <View className="flex-1">
                        <Pressable
                            onPress={() => setSelected('custom')}
                            className={`rounded-3xl items-center justify-center h-[60px] ${
                                selected === 'custom'
                                    ? 'dark:bg-[#B3EAD3] bg-[#394C46]'
                                    : 'dark:bg-[#444955] bg-[#D0D1D4]'
                            }`}
                        >
                            <BrandText className={`text-[16px] text-center ${
                                    selected === 'custom'
                                    ? 'text-white dark:text-black'
                                    : 'text-black dark:text-white'
                                }`}
                            >
                                Custom
                            </BrandText>
                        </Pressable>
                    </View>

                    <View className="flex-1">
                        <Pressable
                            onPress={() => setSelected('preset')}
                            className={`rounded-3xl items-center justify-center h-[60px] ${
                                selected === 'preset'
                                    ? 'dark:bg-[#B3EAD3] bg-[#394C46]'
                                    : 'dark:bg-[#444955] bg-[#D0D1D4]'
                            }`}
                        >
                            <BrandText className={`text-[16px] text-center ${
                                    selected === 'preset'
                                    ? 'text-white dark:text-black'
                                    : 'text-black dark:text-white'
                                }`}
                            >
                                Preset
                            </BrandText>
                        </Pressable>
                    </View>
                </View>

                {selected === 'custom'
                    ?
                        <View className="flex-1 justify-between">
                            <View className="mt-6">
                                <UserInput
                                    value={title}
                                    onChangeText={(text) => handleChange(text)}
                                    placeholder="Add custom chore here"
                                    error={formErrors.title}
                                />
                            </View>
                            <View className="mb-12">
                                <PrimaryButton onPress={handleSubmit} label="Next"/>
                            </View>
                        </View>
                    :
                        <ScrollView
                            contentContainerClassName="items-center"
                            showsVerticalScrollIndicator={true}
                            className="mb-12"
                        >
                            <PresetChoreButton chore="Feed the pet(s)"/>
                            <PresetChoreButton chore="Wash the dishes"/>
                            <PresetChoreButton chore="Load the dishwasher"/>
                            <PresetChoreButton chore="Unload the dishwasher"/>
                            <PresetChoreButton chore="Take out the trash"/>
                            <PresetChoreButton chore="Make your bed"/>
                            <PresetChoreButton chore="Clean your room"/>
                            <PresetChoreButton chore="Clean the bathroom"/>
                            <PresetChoreButton chore="Clean the kitchen"/>
                            <PresetChoreButton chore="Water the plants"/>
                            <PresetChoreButton chore="Vacuum"/>
                            <PresetChoreButton chore="Complete yard work"/>
                            <PresetChoreButton chore="Walk the dog(s)"/>
                            <PresetChoreButton chore="Do your laundry"/>
                            <PresetChoreButton chore="Prepare meal(s)"/>
                        </ScrollView>
                }

            </View>
        </TouchableWithoutFeedback>
    )
}