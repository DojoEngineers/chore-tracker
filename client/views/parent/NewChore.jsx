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
import { useLogin } from "../../context/UserContext"
import { AddKidIcon } from "../../components/icons/AddKidIcon"
import { LargeKidsIcon } from "../../components/icons/LargeKidsIcon"

export const NewChore = () => {

    const [selected, setSelected] = useState('custom')
    const [title, setTitle] = useState('')
    const [formErrors, setFormErrors] = useState({})

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    const handleChange = (value) => {
        setTitle(value)
        if (value.length < 3) {
            setFormErrors(prev => ({...prev, title: "Title must be at least 3 characters."}))
        }
        else if (value.length > 30) {
            setFormErrors(prev => ({...prev, title: "Title cannot exceed 30 characters."}))
        }
        else setFormErrors(prev => ({...prev, title: false}))
    }

    const handleSubmit = () => {
        if (!title || formErrors.title){
            Toast.show({type: 'error', text1: "Please make corrections to the form."})
        }
        else navigation.navigate("NewChoreDetails", {title})
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">

                <View className="flex-row w-full mt-[13%] items-center mb-8">
                    <Pressable
                        hitSlop={20}
                        className="ps-2 pe-8"
                        onPress={() => navigation.goBack()}
                    >
                        <CloseIcon />
                    </Pressable>

                    <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                        New Chore
                    </BrandBoldText>
                </View>

                {loggedInData.family.children.length === 0
                    ? 
                        <ScrollView
                            contentContainerClassName="items-center flex-grow"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="flex-1 w-full">
                                <BrandBoldText
                                    className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText ms-3 mb-4"
                                >
                                    Please add a kid before creating a chore
                                </BrandBoldText>

                                <View className="p-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3">
                                    <View className="flex-row">
                                        <AddKidIcon />

                                        <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText ms-6">
                                            How to add a kid
                                        </BrandBoldText>
                                    </View>

                                    <BrandText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText my-4 ms-12">
                                        Tap the button to add a kid. After adding a kid, they will receive an email with a verification code.
                                    </BrandText>

                                    <View className="bg-[#DFE8E4] dark:bg-darkBg rounded-3xl py-4 px-5 ms-11">
                                        <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText">
                                            Next step: 
                                            <BrandText> Your kid will use the ‘Verify’ link on our home page to enter the code and create their account.</BrandText>
                                        </BrandBoldText>
                                    </View>
                                </View>

                                <View className="w-full mt-6">
                                    <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                                </View>

                                <View className="flex-1 items-center w-full mt-[10%] mb-[5%]">
                                    <LargeKidsIcon />

                                    <BrandText className="text-[16px] text-[#737780] dark:text-[#A1A4AA] mt-[30px]">
                                        No kids added yet
                                    </BrandText>
                                </View>
                            </View>
                        </ScrollView>

                    :
                        <View className="flex-1">
                            <View className="flex-row mb-6 gap-5">
                                <View className="flex-1">
                                    <Pressable
                                        onPress={() => setSelected('custom')}
                                        className={`rounded-3xl items-center justify-center h-[60px]
                                            ${selected === 'custom'
                                                ? 'dark:bg-[#B3EAD3] bg-[#394C46]'
                                                : 'dark:bg-[#444955] bg-[#D0D1D4]'}`}
                                    >
                                        <BrandText className={`text-[16px] text-center
                                            ${selected === 'custom'
                                                ? 'text-white dark:text-black'
                                                : 'text-black dark:text-white'}`}
                                        >
                                            Custom
                                        </BrandText>
                                    </Pressable>
                                </View>

                                <View className="flex-1">
                                    <Pressable
                                        onPress={() => setSelected('preset')}
                                        className={`rounded-3xl items-center justify-center h-[60px]
                                            ${selected === 'preset'
                                                ? 'dark:bg-[#B3EAD3] bg-[#394C46]'
                                                : 'dark:bg-[#444955] bg-[#D0D1D4]'}`}
                                    >
                                        <BrandText className={`text-[16px] text-center
                                            ${selected === 'preset'
                                                ? 'text-white dark:text-black'
                                                : 'text-black dark:text-white'}`}
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
                                        
                                        <View className="mb-[50px]">
                                            <PrimaryButton onPress={handleSubmit} label="Next"/>
                                        </View>
                                    </View>

                                :
                                    <ScrollView
                                        contentContainerClassName="items-center"
                                        showsVerticalScrollIndicator={false}
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
                }
            </View>
        </TouchableWithoutFeedback>
    )
}