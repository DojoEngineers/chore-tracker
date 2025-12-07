import { useCallback, useState } from "react"
import { getChoreById, updateChore } from "../../services/chore.service"
import { retrievePhotos, storePhotos } from "../../services/r2.service"
import Toast from "react-native-toast-message"
import { Alert, Pressable, ScrollView, View, Linking, Image } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
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
import * as ImagePicker from 'expo-image-picker';
import { WeeklyRepeatIcons } from "../../components/WeeklyRepeatIcons";
import { ImageModal } from "../../components/ImageModal"

dayjs.extend(utc)

const API_ERROR_KEYS = [
    'getChoreById',
    'deleteChore',
    'approveChore',
    'rejectChore',
    'completeChore',
    'addBeforeImageToChore',
    'addBeforeImage',
    'retrievePhotos'
]

export const ViewChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})
    const [loading, setLoading] = useState("Loading chore...")
    const [selectedImage, setSelectedImage] = useState()
    const [modalVisible, setModalVisible] = useState({delete: false, reject: false, complete: false, image: false})
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()
    const {id} = route.params
    const {loggedInData} = useLogin()

    useFocusEffect(
        useCallback(() => {
            setLoading("Loading chore...")
            setApiErrors({})

            getChoreById(id)
                .then((res) => {
                    const updatedChore = { ...res }
                    const photoFilesToRetrieve = []

                    // Check if beforePic expired
                    if (res.beforePic?.expiresAt && new Date(res.beforePic.expiresAt) <= new Date()) {
                        photoFilesToRetrieve.push(res.beforePic.fileName)
                    }

                    // Check if afterPic expired
                    if (res.afterPic?.expiresAt && new Date(res.afterPic.expiresAt) <= new Date()) {
                        photoFilesToRetrieve.push(res.afterPic.fileName)
                    }

                    // Get new urls if expired
                    if (photoFilesToRetrieve.length > 0) {
                        retrievePhotos(photoFilesToRetrieve)
                            .then((photos) => {
                                photos.forEach((photo) => {
                                    if (updatedChore.beforePic?.fileName === photo.fileName) {
                                        updatedChore.beforePic = { ...updatedChore.beforePic, url: photo.url, expiresAt: photo.expiresAt }
                                    }
                                    if (updatedChore.afterPic?.fileName === photo.fileName) {
                                        updatedChore.afterPic = { ...updatedChore.afterPic, url: photo.url, expiresAt: photo.expiresAt }
                                    }
                                })
                                setChore(updatedChore)
                            })
                            .catch((error) => {
                                console.log("retrievePhotos error:", error)
                                setApiErrors(prev => ({...prev, retrievePhotos: "Unable to retrieve photos."}))
                                Toast.show({type: 'error', text1: "Unable to retrieve photos."})
                            })
                    } else {
                        setChore(updatedChore)
                    }
                })
                .catch((error) => {
                    console.log("getChoreById error:", error)
                    setApiErrors(prev => ({...prev, getChoreById: "Unable to get chore information."}))
                    Toast.show({type: 'error', text1: "Unable to get chore information."})
                })
                .finally(() => setLoading(false))
        }, [id])
    )

    const handleApprove = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        updateChore({_id: id, stage: "approved", stageDate: dayjs().toISOString()})
            .then(() => {
                Toast.show({type: 'success', text1: "Chore approved!"})
                navigation.goBack()
            })
            .catch((error) => {
                console.log("approveChore error:", error)
                setApiErrors(prev => ({...prev, approveChore: "Unable to approve chore."}))
                Toast.show({type: 'error', text1: "Unable to approve chore."})
            })
            .finally(() => setIsButtonLoading(false))
    }

    const takeBeforePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                "Camera permission required",
                "Please enable camera access in your phone's settings.",
                [
                    {text: "Cancel", style: "cancel"},
                    {text: "Open Settings", onPress: () => Linking.openSettings()}
                ]
            )
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            storePhotos(uri, chore.beforePic?.fileName)
                .then((res) => {
                    setChore(prev => ({...prev, beforePic: res}))
                    updateChore({_id: id, beforePic: res})
                        .then(() => {
                            Toast.show({type: 'success', text1: "Before photo added!"})
                        })
                        .catch((error) => {
                            console.log("addBeforeImageToChore error:", error)
                            setApiErrors(prev => ({...prev, addBeforeImageToChore: "Unable to add before image to chore."}))
                            Toast.show({type: 'error', text1: "Unable to add before image to chore."})
                        })
                })
                .catch((error) => {
                    console.log("addBeforeImage error:", error)
                    setApiErrors(prev => ({...prev, addBeforeImage: "Unable to save before image."}))
                    Toast.show({type: 'error', text1: "Unable to save before image."})
                })
        }
    }
        
    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">
        
            <View className="flex-row w-full mt-[13%] items-center mb-4">
                <Pressable
                    hitSlop={20}
                    className="ps-2 pe-8"
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow />
                </Pressable>

                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    {chore?.title}
                </BrandBoldText>
            </View>

            {API_ERROR_KEYS.map(key => 
                apiErrors[key] && (
                    <BrandText key={key} className="text-red-500 text-center">
                        {apiErrors[key]}
                    </BrandText>
                )
            )}

            {loading
                ?
                    <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText">
                        {loading}
                    </BrandText>

                :
                    <View className="flex-1">
                        <ScrollView
                            contentContainerClassName="flex-grow"
                            showsVerticalScrollIndicator={false}
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

                            <View className="flex-row items-center my-6 mx-2 justify-between">
                                <View className="items-center flex-row">
                                    <RepeatIcon />

                                    <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] ms-4">
                                        {chore.repeat?.charAt(0).toUpperCase() + chore.repeat?.slice(1)}
                                    </BrandText>
                                </View>

                                {chore.repeat === "weekly" &&
                                    <WeeklyRepeatIcons chore={chore} fontSize={16} circleSize={30}/>
                                }
                            </View>

                            <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />

                            <View className="flex-row items-center my-6 ms-2 me-[24px]">
                                <StageIcon />

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

                            {(chore.beforePic?.url || chore.afterPic?.url) &&
                                <View>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        className="flex-1 my-6 mx-2"
                                    >
                                        {chore.beforePic?.url && (
                                            <View className="mr-6">
                                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] mb-2">
                                                    Before Photo
                                                </BrandText>

                                                <Pressable
                                                    onPress={() =>{
                                                        setSelectedImage(chore.beforePic.url)
                                                        setModalVisible(prev => ({...prev, image: true}))
                                                    }}
                                                >
                                                    <Image
                                                        source={{uri: chore.beforePic.url}}
                                                        className="w-[200px] h-[200px] rounded-lg"
                                                    />
                                                </Pressable>
                                            </View>
                                        )}

                                        {chore.afterPic?.url && (
                                            <View>
                                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-[#ECEDEE] mb-2">
                                                    After Photo
                                                </BrandText>

                                                <Pressable
                                                    onPress={() =>{
                                                        setSelectedImage(chore.afterPic.url)
                                                        setModalVisible(prev => ({...prev, image: true}))
                                                    }}
                                                >
                                                    <Image
                                                        source={{uri: chore.afterPic.url}}
                                                        className="w-[200px] h-[200px] rounded-lg"
                                                    />
                                                </Pressable>
                                            </View>
                                        )}
                                    </ScrollView>

                                    <View className="h-[1px] bg-lightPrimaryText dark:bg-[#737780] w-full" />
                                </View>
                            }

                        </ScrollView>

                        {(chore.stage === "incomplete" || chore.stage === "rejectedReassigned")
                            ?
                                loggedInData.isParent
                                    ?
                                        <View className="mb-[10%]">
                                            <Pressable
                                                onPress={() => navigation.navigate("NewChoreDetails", {chore})}
                                                className="p-[10px] rounded-full items-center justify-center bg-[#9FB6AE] dark:bg-darkButton w-full h-[56px] mt-4"
                                            >
                                                <BrandBoldText className="text-[#111215] dark:text-[#ECEDEE] text-[20px] ms-4">
                                                    Edit chore
                                                </BrandBoldText>
                                            </Pressable>
                                            
                                            <Pressable
                                                onPress={() => setModalVisible(prev => ({...prev, delete: true}))}
                                                className="p-[10px] rounded-full items-center justify-center bg-[#737780] w-full h-[56px] mt-5"
                                            >
                                                <BrandBoldText className="text-[#111215] dark:text-[#ECEDEE] text-[20px] ms-4">
                                                    Delete chore
                                                </BrandBoldText>
                                            </Pressable>
                                        </View>

                                    : chore.worker._id === loggedInData._id ?
                                        <View className="mb-[10%]">
                                            <Pressable
                                                onPress={takeBeforePhoto}
                                                className="p-[10px] rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px] mt-4"
                                            >
                                                <BrandBoldText className="text-[#ECEDEE] text-[20px] ms-4">
                                                    {chore.beforePic ? "Resubmit" : "Submit"} before photo
                                                </BrandBoldText>
                                            </Pressable>
                                            
                                            <Pressable
                                                onPress={() => setModalVisible(prev => ({...prev, complete: true}))}
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
                            <View className="mb-[10%]">

                                <Pressable
                                    onPress={!isButtonLoading ? handleApprove : null}
                                    disabled={isButtonLoading}
                                    className={`
                                        p-[10px] rounded-full items-center justify-center dark:bg-[#B3EAD3] bg-[#84A99D] w-full h-[56px] mt-5
                                        ${isButtonLoading ? 'opacity-50' : ''}
                                    `}
                                >
                                    <BrandBoldText className="text-darkPrimaryText dark:text-lightPrimaryText text-[20px] ms-4">
                                        {!isButtonLoading ? "Approve" : "Loading..."}
                                    </BrandBoldText>
                                </Pressable>

                                <Pressable
                                    onPress={() => setModalVisible(prev => ({...prev, reject: true}))}
                                    className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px] mt-4"
                                >
                                    <BrandBoldText className="text-darkPrimaryText text-[20px] ms-4">
                                        Reject
                                    </BrandBoldText>
                                </Pressable>
                            </View>
                        }

                        <DeleteModal
                            visible={modalVisible.delete}
                            setVisible={setModalVisible}
                            setApiErrors={setApiErrors}
                            id={id}
                        />

                        <RejectModal
                            visible={modalVisible.reject}
                            setVisible={setModalVisible}
                            setApiErrors={setApiErrors}
                            id={id}
                        />

                        <CompleteModal
                            visible={modalVisible.complete}
                            setVisible={setModalVisible}
                            setApiErrors={setApiErrors}
                            id={id}
                            needsPics={chore.needsPics}
                            setChore={setChore}
                        />

                        <ImageModal
                            visible={modalVisible.image}
                            setVisible={setModalVisible}
                            imageUri={selectedImage}
                        />
                    </View>
            }
        </View>
    )
}