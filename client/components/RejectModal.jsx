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

export const RejectModal = ({visible, setVisible, setApiErrors, id}) => {

    const [parentComments, setParentComments] = useState("")
    const [stage, setStage] = useState("rejectedUnassigned")
    const [commentsError, setCommentsError] = useState("")
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const placeholderColor = colorScheme === 'dark' ? '#D0D1D4' : '#262626'

    const handleChange = (comments) => {
        setParentComments(comments)
        if (comments.length > 100) {
            setCommentsError("Comments cannot exceed 100 characters.")
        } else {
            setCommentsError(false)
        }
    }

    const handleReject = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        if (commentsError) {
            Toast.show({type: 'error', text1: "Please make corrections to the form."})
            setIsButtonLoading(false)
            return
        }

        updateChore({_id: id, stage, stageDate: dayjs().toISOString(), parentComments})
            .then(() => {
                Toast.show({type: 'success', text1: "Chore rejected!"})
                navigation.goBack()
            })
            .catch((error) => {
                console.log("rejectChore error:", error)
                setApiErrors(prev => ({...prev, rejectChore: "Unable to reject chore."}))
                Toast.show({type: 'error', text1: "Unable to reject chore."})
            })
            .finally(() => setIsButtonLoading(false))
    }

    const handleCheckbox = () => {
        if (stage === "rejectedUnassigned") {
            setStage("rejectedReassigned")
        } else {
            setStage("rejectedUnassigned")
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(prev => ({...prev, reject: false}))}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View
                    className="flex-1 justify-center items-center"
                    style={{backgroundColor: 'rgba(68, 73, 85, 0.5)'}}
                >
                    <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[90%]">

                        <Pressable
                            hitSlop={20}
                            className="mb-6"
                            onPress={() => setVisible(prev => ({...prev, reject: false}))}
                        >
                            <CloseIcon />
                        </Pressable>

                        <View className="flex-row items-center space-x-2 mb-6">
                            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] me-2 ms-1">
                                Reassign this chore?
                            </BrandText>
                            
                            <Checkbox.Android
                                status={stage === "rejectedReassigned" ? "checked" : "unchecked"}
                                onPress={handleCheckbox}
                                color="#34D399"
                                uncheckedColor="#34D399"
                            />
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
                            value={parentComments}
                            onChangeText={(comments) => handleChange(comments)}
                            placeholder="Add comments here"
                            placeholderTextColor={placeholderColor}
                            multiline={true}
                            textAlignVertical="top"
                        />
                        
                        <Pressable
                            className={`
                                p-[10px] items-center justify-center bg-[#F40000] rounded-full w-full
                                ${isButtonLoading ? 'opacity-50' : ''}
                            `}
                            onPress={!isButtonLoading ? handleReject : null}
                            disabled={isButtonLoading}
                        >
                            <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                {!isButtonLoading ? "Reject" : "Loading..."}
                            </BrandBoldText>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}