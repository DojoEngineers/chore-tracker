import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { getChoreById, updateChore } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { BackArrow } from "../../components/icons/BackArrow"
import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { Header } from "../../components/Header"
import { BrandText } from "../../components/text/BrandText"
import { ParentNavBar } from "../../components/ParentNavBar"
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs"

dayjs.extend(utc)

export const ApproveChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})
    const [loading, setLoading] = useState("Loading chore...")

    const navigation = useNavigation()
    const {id} = route.params

    useEffect(() => {
        getChoreById(id)
            .then((res) => {
                setChore(res)
            })
            .catch((error) => {
                console.log("getChoreById error:", error)
                setApiErrors(prev => ({...prev, getChoreById: "Unable to get chore information."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to get chore information."
                })
            })
            .finally(() => setLoading(false))
    }, [])

    const handleApprove = (_id) => {
        updateChore({_id, stage: "approved", dateApproved: dayjs().toISOString()})
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Chore approved!"
                })
                navigation.goBack()
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
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <Header />
            
            <View className="flex-row w-full items-center mb-4 px-[16px]">
                <Pressable
                    hitSlop={20}
                    className="ps-2 pe-8"
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow />
                </Pressable>
                <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Approve
                </BrandBoldText>
            </View>

            {apiErrors.getChoreById && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.getChoreById}
                </BrandText>
            )}

            {apiErrors.updateChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.updateChore}
                </BrandText>
            )}

            {loading && (
                <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText">
                    {loading}
                </BrandText>
            )}

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                {chore.title}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                Assigned by: {chore.creator?.name}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                Completed by: {chore.worker?.name}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                on {dayjs(chore.dateCompleted).local().format("dddd, MMMM D")} at {dayjs(chore.dueDate).local().format("h:mma")}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                {chore.needsPics ? "Photo required" : "Photo not required"}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                {chore.details ? chore.details : "No notes provided"}
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                Repeats: {chore.repeat?.charAt(0).toUpperCase() + chore.repeat?.slice(1)}
            </BrandBoldText>

            <View className="px-[16px]">
                <Pressable
                    onPress={() => handleApprove(chore._id)}
                    className="p-[10px] rounded-full items-center justify-center dark:bg-[#B3EAD3] bg-[#84A99D] w-full h-[56px] mt-5"
                >
                    <BrandBoldText className="text-darkPrimaryText dark:text-lightPrimaryText text-[20px] ms-4">
                        Approve
                    </BrandBoldText>
                </Pressable>

                <Pressable
                    onPress={() => navigation.navigate("RejectComments", {_id: chore._id, kid: chore.worker.name, title: chore.title})}
                    className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px] mt-4"
                >
                    <BrandBoldText className="text-darkPrimaryText text-[20px] ms-4">
                        Reject
                    </BrandBoldText>
                </Pressable>
            </View>

            <View className="absolute bottom-0 left-0 right-0">
                <ParentNavBar />
            </View>
        </View>

    )
}