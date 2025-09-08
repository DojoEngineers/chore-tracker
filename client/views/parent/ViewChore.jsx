import { useEffect, useState } from "react"
import { getChoreById, updateChore } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { Modal, Pressable, View } from "react-native"
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
import { CloseIcon } from "../../components/icons/CloseIcon"
import { StageIcon } from "../../components/icons/StageIcon"

dayjs.extend(utc)

export const ViewChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})
    const [loading, setLoading] = useState("Loading chore...")
    const [modalVisible, setModalVisible] = useState(false)

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

    const handleDelete = () => {
        updateChore({isActive: false})
            .then( () => { 
                Toast.show({
                    type: 'success',
                    text1: "Chore successfully deleted!"
                })
                navigation.goBack()
            })
            .catch( error => {
                console.log("updateChore error:", error)
                setApiErrors(prev => ({...prev, updateChore: "Unable to delete chore."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to delete chore."
                })
            })
    }
        
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
                            Created by{" "}
                        </BrandText>
                        <BrandText className="text-[16px] text-darkButton">
                            {chore.creator?.name}
                        </BrandText>
                    </View>

                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                    <View className="flex-row items-center my-6 mx-2">
                        <AssignedToIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            Assigned to{" "}
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
                        <StageIcon />
                        <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                            {chore.stage?.charAt(0).toUpperCase() + chore.stage?.slice(1)}
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

            {chore.stage === "incomplete" && 
                <View className="mb-12">

                    <Pressable
                        onPress={() => navigation.navigate("NewChore")}
                        className="p-[10px] rounded-full items-center justify-center bg-[#9FB6AE] dark:bg-darkButton w-full h-[56px] mt-4"
                    >
                            <BrandBoldText className="text-[#111215] dark:text-[#ECEDEE] text-[20px] ms-4">
                                Edit chore
                            </BrandBoldText>
                    </Pressable>
                    
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        className="p-[10px] rounded-full items-center justify-center bg-[#737780] w-full h-[56px] mt-5"
                    >
                        <BrandBoldText className="text-[#111215] dark:text-[#ECEDEE] text-[20px] ms-4">
                            Delete chore
                        </BrandBoldText>
                    </Pressable>
                </View>
            }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        className="flex-1 justify-center items-center"
                        style={{backgroundColor:  'rgba(68, 73, 85, 0.5)'}}
                    >
                        <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-xl w-[250px]">
                            <View className="flex-row items-center">
                                <Pressable
                                    hitSlop={20}
                                    className="pe-4 me-6"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <CloseIcon />
                                </Pressable>
                                <BrandBoldText className="dark:text-darkPrimaryText text-[#111215] text-[16px]">
                                    Confirm Delete
                                </BrandBoldText>
                            </View>

                            <BrandText className="dark:text-darkPrimaryText text-[#111215] text-[16px] my-4">
                                Are you sure you want to delete this chore?
                            </BrandText>

                            <Pressable
                                className="p-[10px] items-center justify-center bg-[#F40000] rounded-full w-full"
                                onPress={handleDelete}
                            >
                                <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                    Delete
                                </BrandBoldText>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

        </View>
    )
}