import { useEffect, useState } from "react"
import { getChoreById, updateChore } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { Pressable, ScrollView, View } from "react-native"
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
import { StageIcon } from "../../components/icons/StageIcon"
import { DeleteModal } from "../../components/DeleteModal"
import { RejectModal } from "../../components/RejectModal"
import { useLogin } from "../../context/UserContext"
import { CompleteModal } from "../../components/CompleteModal"

dayjs.extend(utc)

export const ViewChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})
    const [loading, setLoading] = useState("Loading chore...")
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [rejectModalVisible, setRejectModalVisible] = useState(false)
    const [completeModalVisible, setCompleteModalVisible] = useState(false)

    const navigation = useNavigation()
    const {id} = route.params
    const {loggedInData} = useLogin()

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
        updateChore({_id, stage: "approved", stageDate: dayjs().toISOString()})
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Chore approved!"
                })
                navigation.replace("Dashboard", {animationType: "slide_from_left"})
            })
            .catch((error) => {
                console.log("approveChore error:", error)
                setApiErrors(prev => ({...prev, approveChore: "Unable to approve chore."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to approve chore."
                })
            })
    }
        
    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">
        
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
            {apiErrors.deleteChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.deleteChore}
                </BrandText>
            )}
            {apiErrors.approveChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.approveChore}
                </BrandText>
            )}
            {apiErrors.rejectChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.rejectChore}
                </BrandText>
            )}
            {apiErrors.completeChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.completeChore}
                </BrandText>
            )}

            {loading && (
                <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText">
                    {loading}
                </BrandText>
            )}

            <ScrollView
                contentContainerClassName="flex-grow"
                showsVerticalScrollIndicator={true}
                className="flex-1"
            >
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

                <View className="flex-row items-center my-6 ms-2 me-[24px]">
                    <StageIcon />
                    <View className="">
                        <BrandText
                            className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.5}
                        >
                            {chore.stage === "incomplete" ? "Incomplete"
                                : chore.stage === "complete" ? "Completed on "
                                : chore.stage === "approved" ? "Approved on "
                                : chore.stage === "rejectedReassigned" ? "Rejected and reassigned on "
                                : "Rejected on "
                            }
                            {chore.stage !== "incomplete"
                                ? dayjs(chore.stageDate).local().format("MMMM D [at] h:mma")
                                : dayjs(chore.dueDate).isBefore(dayjs()) ? " • Overdue"
                                : ""
                            }
                        </BrandText>
                    </View>
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
                
                {chore.details &&
                    <View>
                        <View className="flex-row items-start my-6 mx-2">
                            <View className="flex-row items-center">
                                <WriteIcon />
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                                    Notes
                                </BrandText>
                            </View>
                            <View className="flex-1 ms-[56px]">
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE]">
                                    {chore.details}
                                </BrandText>
                            </View>
                        </View>

                        <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />
                    </View>
                }

                {chore.parentComments &&
                    <View>
                        <View className="flex-row items-start my-6 mx-2">
                            <View className="flex-row items-start">
                                <WriteIcon />
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                                    Parent{"\n"}Comments
                                </BrandText>
                            </View>
                            <View className="flex-1 ms-6">
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE]">
                                    {chore.parentComments}
                                </BrandText>
                            </View>
                        </View>

                        <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />
                    </View>
                }

                {chore.kidComments &&
                    <View>
                        <View className="flex-row items-start my-6 mx-2">
                            <View className="flex-row items-start">
                                <WriteIcon />
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                                    Kid{"\n"}Comments
                                </BrandText>
                            </View>
                            <View className="flex-1 ms-6">
                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE]">
                                    {chore.kidComments}
                                </BrandText>
                            </View>
                        </View>

                        <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />
                    </View>
                }
            </ScrollView>

            {(chore.stage === "incomplete" || chore.stage === "rejectedReassigned")
                ?
                    loggedInData.isParent
                        ?
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
                                    onPress={() => setDeleteModalVisible(true)}
                                    className="p-[10px] rounded-full items-center justify-center bg-[#737780] w-full h-[56px] mt-5"
                                >
                                    <BrandBoldText className="text-[#111215] dark:text-[#ECEDEE] text-[20px] ms-4">
                                        Delete chore
                                    </BrandBoldText>
                                </Pressable>
                            </View>

                        : chore.worker._id === loggedInUser._id ?
                            <View className="mb-12">
                                <Pressable
                                    onPress={[]}
                                    className="p-[10px] rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px] mt-4"
                                >
                                        <BrandBoldText className="text-[#ECEDEE] text-[20px] ms-4">
                                            {chore.beforePic ? "Resubmit" : "Submit"} before photo
                                        </BrandBoldText>
                                </Pressable>
                                
                                <Pressable
                                    onPress={() => setCompleteModalVisible(true)}
                                    className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px] mt-5"
                                >
                                    <BrandBoldText className="text-[#ECEDEE] text-[20px] ms-4">
                                        Complete chore
                                    </BrandBoldText>
                                </Pressable>
                            </View>
                            
                        : null
                : null
            }

            {(chore.stage === "complete" && loggedInData.isParent) && 
                <View className="mb-12">

                    <Pressable
                        onPress={() => handleApprove(chore._id)}
                        className="p-[10px] rounded-full items-center justify-center dark:bg-[#B3EAD3] bg-[#84A99D] w-full h-[56px] mt-5"
                    >
                        <BrandBoldText className="text-darkPrimaryText dark:text-lightPrimaryText text-[20px] ms-4">
                            Approve
                        </BrandBoldText>
                    </Pressable>

                    <Pressable
                        onPress={() => setRejectModalVisible(true)}
                        className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px] mt-4"
                    >
                        <BrandBoldText className="text-darkPrimaryText text-[20px] ms-4">
                            Reject
                        </BrandBoldText>
                    </Pressable>
                </View>
            }

            <DeleteModal
                visible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                setApiErrors={setApiErrors}
                id={id}
            />

            <RejectModal
                visible={rejectModalVisible}
                setVisible={setRejectModalVisible}
                setApiErrors={setApiErrors}
                id={id}
            />

            <CompleteModal
                visible={completeModalVisible}
                setVisible={setCompleteModalVisible}
                setApiErrors={setApiErrors}
                id={id}
                needsPics={chore.needsPics}
            />

        </View>
    )
}