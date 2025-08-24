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

                <View className="flex-row w-full mt-[70px] items-center mb-8">
                    <Pressable
                        hitSlop={20}
                        className="ps-6 pe-8"
                        onPress={() => navigation.navigate("ParentDashboard", {animationType: "fade"})}
                    >
                        <CloseIcon />
                    </Pressable>
                    <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                        New Chore
                    </BrandBoldText>
                </View>

                <View className="flex-row items-center justify-between mb-6">
                    <Pressable
                        onPress={() => setSelected('custom')}
                        className={`p-[10px] rounded-xl items-center justify-center w-[175px] h-[60px] ${
                            selected === 'custom'
                                ? 'dark:bg-[#B3EAD3] bg-[#B4684E]'
                                : 'dark:bg-[#444955] bg-[#DFAE9D]'
                        }`}
                    >
                        <BrandText className={selected === 'custom' ? 'text-white dark:text-black text-[16px]' : 'text-black dark:text-white text-[16px]'}>
                            Custom
                        </BrandText>
                    </Pressable>

                    <Pressable
                        onPress={() => setSelected('preset')}
                        className={`p-[10px] rounded-xl items-center justify-center w-[175px] h-[60px] ${
                            selected === 'preset'
                                ? 'dark:bg-[#B3EAD3] bg-[#B4684E]'
                                : 'dark:bg-[#444955] bg-[#DFAE9D]'
                        }`}
                    >
                        <BrandText className={selected === 'preset' ? 'text-white dark:text-black text-[16px]' : 'text-white text-[16px]'}>
                            Preset
                        </BrandText>
                    </Pressable>
                </View>

                {selected === 'custom'
                    ?
                        <View className="mt-10">
                            <UserInput
                                value={title}
                                onChangeText={(text) => handleChange(text)}
                                placeholder="Add custom chore here"
                                error={formErrors.title}
                            />

                            <View className="mt-6">
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