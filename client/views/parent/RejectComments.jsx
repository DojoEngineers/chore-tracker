import { Keyboard, Pressable, TextInput, TouchableWithoutFeedback, useColorScheme, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs"
import { updateChore } from "../../services/chore.service"
import {ParentNavBar} from "../../components/ParentNavBar"

dayjs.extend(utc)

export const RejectComments = ({route}) => {

    const [comments, setComments] = useState("")
    const [apiErrors, setApiErrors] = useState({})

    const {_id, title} = route.params
    const navigation = useNavigation()

    const colorScheme = useColorScheme();
    const placeholderColor = colorScheme === 'dark' ? '#D0D1D4' : '#737780';

    const handleReject = () => {
        updateChore({_id, stage: "rejected", dateRejected: dayjs().toISOString()}, comments)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Chore rejected!"
                })
                navigation.navigate("ApproveDashboard", {animationType: "fade_from_bottom"})
            })
            .catch((error) => {
                console.log("updateChore error:", error)
                setApiErrors(prev => ({...prev, updateChore: "Unable to update chore."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to update chore."
                })
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-[#D0D1D4] dark:bg-darkBg">

                <View className="flex-1 px-[16px]">
                    <View className="flex-row w-full items-center mt-[75px]">
                        <Pressable
                            hitSlop={20}
                            className="ps-2 pe-8"
                            onPress={() => navigation.goBack()}
                        >
                            <BackArrow />
                        </Pressable>
                        <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                            Reject
                        </BrandBoldText>
                    </View>

                    {apiErrors.updateChore && (
                        <BrandText className="text-red-500 text-center">
                            {apiErrors.updateChore}
                        </BrandText>
                    )}

                    <BrandBoldText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-[40px]"
                    >
                        {title}
                    </BrandBoldText>

                    <TextInput
                        className="dark:border dark:border-[#D0D1D4] rounded-lg p-3 bg-[#ECEDEE] dark:bg-transparent
                            text-lightPrimaryText dark:text-darkPrimaryText h-[103px] mb-[40px] font-nunito text-[15px]"
                        value={comments}
                        onChangeText={setComments}
                        placeholder="Add comments here"
                        placeholderTextColor={placeholderColor}
                        multiline={true}
                        textAlignVertical="top"
                    />

                    <PrimaryButton label="Submit" onPress={() => handleReject()} />
                </View>

                <ParentNavBar />

            </View>
        </TouchableWithoutFeedback>
    )
}