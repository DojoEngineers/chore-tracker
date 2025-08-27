import { useEffect, useState } from "react"
import { getChoreById } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useNavigation } from "@react-navigation/native"
import { BackArrow } from "../../components/icons/BackArrow"
import dayjs from "dayjs"
import { BrandText } from "../../components/text/BrandText"
import {AssignedToIcon} from "../../components/icons/AssignedToIcon"
import utc from 'dayjs/plugin/utc'
import {RepeatIcon} from "../../components/icons/RepeatIcon"
import {DateIcon} from "../../components/icons/DateIcon"
import {ClockIcon} from "../../components/icons/ClockIcon"
import {WriteIcon} from "../../components/icons/WriteIcon"
import {CameraIcon} from "../../components/icons/CameraIcon"
import {PrimaryButton} from "../../components/PrimaryButton"

dayjs.extend(utc)

export const ViewChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})
    const [loading, setLoading] = useState("Loading chore...")

    const navigation = useNavigation()

    const {id} = route.params

    useEffect(() => {
        getChoreById(id)
            .then((res) => {
                console.log("res console.log", res.creator, res.creator.name)
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
    
    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px] justify-between">
        
            <View>
                <View className="flex-row w-full mt-[70px] items-center mb-4">
                    <Pressable
                        hitSlop={20}
                        className="ps-2 pe-8"
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow />
                    </Pressable>
                    <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                        {chore.title}
                    </BrandBoldText>
                </View>

                {apiErrors.getChoreById && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.getChoreById}
                    </BrandText>
                )}

                {loading && (
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText">
                        {loading}
                    </BrandText>
                )}

                <View>
                    <View className="flex-row items-center my-6 mx-2">
                        <AssignedToIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            Created by:{" "}
                        </BrandText>
                        <BrandText className="text-[16px] text-darkButton">
                            {chore.creator?.name}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <AssignedToIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            Assigned to:{" "}
                        </BrandText>
                        <BrandText className="text-[16px] text-darkButton">
                            {chore.worker?.name}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <RepeatIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            {chore.repeat?.charAt(0).toUpperCase() + chore.repeat?.slice(1)}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <DateIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            Due {dayjs(chore.dueDate).local().format("dddd, MMMM D")}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <ClockIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            at {dayjs(chore.dueDate).local().format("h:mma")}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <CameraIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            {chore.needsPics ? "Photo required" : "Photo not required"}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />
                    
                    <View className="flex-row items-start my-6 mx-2">
                        <View className="flex-row items-center">
                            <WriteIcon />
                            <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                                Notes
                            </BrandText>
                        </View>
                        <View className="flex-1 ms-12">
                            <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE]">
                                {chore.details ? chore.details : "No notes provided"}
                            </BrandText>
                        </View>
                    </View>
                </View>
            </View>

            <View className="mb-12">
                <PrimaryButton label="Edit" onPress={() => navigation.navigate("NewChore")}/>
                
                <Pressable
                    onPress={[]}
                    className="p-[10px] rounded-full items-center justify-center bg-[#737780] w-full h-[56px] mt-4"
                >
                    <BrandBoldText className="text-white text-[20px]">
                        Delete
                    </BrandBoldText>
                </Pressable>
            </View>
        </View>
    )
}