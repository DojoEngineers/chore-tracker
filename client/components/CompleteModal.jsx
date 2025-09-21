import { Keyboard, Modal, Pressable, TextInput, TouchableWithoutFeedback, useColorScheme, View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs"
import { updateChore } from "../services/chore.service"
import { CloseIcon } from "./icons/CloseIcon"
import { BrandText } from "./text/BrandText"
import { Checkbox } from "react-native-paper"

dayjs.extend(utc)

export const CompleteModal = ({visible, setVisible, setApiErrors, id, needsPics}) => {

    const [kidComments, setKidComments] = useState("")
    const [commentsError, setCommentsError] = useState("")

    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const placeholderColor = colorScheme === 'dark' ? '#D0D1D4' : '#262626'

    const handleChange = (comments) => {
        setKidComments(comments)
        if (comments.length > 100) {
            setCommentsError("Comments cannot exceed 100 characters.")
        } else {
            setCommentsError(false)
        }
    }

    const handleComplete = () => {
        if (commentsError) {
            Toast.show({
                type: 'error',
                text1: "Please make corrections to the form."
            })
            return
        }

        updateChore({_id: id, stage: "complete", stageDate: dayjs().toISOString(), kidComments})
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Chore completed!"
                })
                navigation.replace("Dashboard", {animationType: "slide_from_left"})
            })
            .catch((error) => {
                console.log("completeChore error:", error)
                setApiErrors(prev => ({...prev, completeChore: "Unable to complete chore."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to complete chore."
                })
            })
    }

    const submitAfterPhoto = () => {
        return
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View
                    className="flex-1 justify-center items-center"
                    style={{backgroundColor:  'rgba(68, 73, 85, 0.5)'}}
                >
                    <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[90%]">

                        <View className="flex-row items-center mb-6">
                            <Pressable
                                hitSlop={20}
                                onPress={() => setVisible(false)}
                            >
                                <CloseIcon />
                            </Pressable>

                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ms-6">
                                Complete chore
                            </BrandText>
                        </View>

                        {commentsError &&
                            <BrandText
                                className="text-red-500 text-[14px] text-center"
                            >
                                    {commentsError}
                            </BrandText>
                        }

                        <TextInput
                            className="border border-[#A1A4AA] dark:border-[#D0D1D4] rounded-2xl p-3 bg-[#D0D1D4] dark:bg-transparent
                                text-lightPrimaryText dark:text-darkPrimaryText h-[80px] mb-8 font-nunito text-[15px]"
                            value={kidComments}
                            onChangeText={(comments) => handleChange(comments)}
                            placeholder="Add comments here"
                            placeholderTextColor={placeholderColor}
                            multiline={true}
                            textAlignVertical="top"
                        />
                        
                        <Pressable
                            className="p-[10px] items-center justify-center bg-[#84A99D] rounded-full w-full"
                            onPress={submitAfterPhoto}
                        >
                            <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                Submit after photo
                            </BrandBoldText>
                        </Pressable>

                        {!needsPics &&
                            <Pressable
                                className="p-[10px] items-center justify-center bg-[#455C56] rounded-full w-full mt-4"
                                onPress={handleComplete}
                            >
                                <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                    Complete without photo
                                </BrandBoldText>
                            </Pressable>
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}