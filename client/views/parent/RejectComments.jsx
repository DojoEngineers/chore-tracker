import { Pressable, TextInput, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs"

dayjs.extend(utc)

export const RejectComments = ({route}) => {

    const [comments, setComments] = useState("")
    const [apiErrors, setApiErrors] = useState({})

    const {_id, kid, title} = route.params
    const navigation = useNavigation()

    const handleReject = () => {
        updateChore({_id, stage: "rejected", dateRejected: dayjs().toISOString()})
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
        <View className="flex-1 bg-[#D0D1D4] dark:bg-[#333740] px-[16px]">

            <View className="flex-row w-full items-center mb-4 mt-[75px]">
                <Pressable
                    hitSlop={20}
                    className="ps-2 pe-8"
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow />
                </Pressable>
                <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Reject
                </BrandBoldText>
            </View>

            {apiErrors.updateChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.updateChore}
                </BrandText>
            )}

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-[30px]"
            >
                {title + "\n" + "Add comments for " + kid}
            </BrandBoldText>

            <View className="my-4">
                <TextInput
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white h-[120px]"
                    value={comments}
                    onChangeText={setComments}
                    placeholder="Add comments here"
                    placeholderTextColor="#888"
                    multiline={true}
                />
            </View>

            <PrimaryButton label="Done" onPress={() => handleReject()} />

        </View>
    )
}