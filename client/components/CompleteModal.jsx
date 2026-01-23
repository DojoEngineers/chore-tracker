import { Alert, Keyboard, Linking, Modal, Pressable, TextInput, TouchableWithoutFeedback, useColorScheme, View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { useCallback, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs"
import { updateChore } from "../services/chore.service"
import { CloseIcon } from "./icons/CloseIcon"
import { BrandText } from "./text/BrandText"
import * as ImagePicker from 'expo-image-picker';
import { storePhotos } from "../services/r2.service"
import { useLogin } from "../context/UserContext"

dayjs.extend(utc)

export const CompleteModal = ({ visible, setVisible, setApiErrors, id, needsPics, setChore, chore }) => {

    const [kidComments, setKidComments] = useState("")
    const [commentsError, setCommentsError] = useState("")
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const { loggedInData, sendPush } = useLogin()

    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const placeholderColor = colorScheme === 'dark' ? '#D0D1D4' : '#262626'

    useFocusEffect(
        useCallback(() => {
            setIsButtonLoading(false)
        }, [])
    )

    const handleChange = (comments) => {
        setKidComments(comments)
        if (comments.length > 100) {
            setCommentsError("Comments cannot exceed 100 characters.")
        } else {
            setCommentsError(false)
        }
    }

    const handleComplete = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        if (commentsError) {
            Toast.show({ type: 'error', text1: "Please make corrections to the form." })
            setIsButtonLoading(false)
            return
        }

        updateChore({ _id: id, stage: "complete", stageDate: dayjs().toISOString(), kidComments })
            .then(() => {
                try {
                    // Send push notifications to all parents
                    const notificationPromises = loggedInData.family.parents
                        .flatMap(parent => 
                            // Map each parent's tokens while keeping parent reference
                            (parent.pushTokens || []).map(token => ({
                                parentId: parent._id,
                                token
                            }))
                        )
                        .map(({ parentId, token }) =>
                            sendPush(
                                parentId,
                                token,
                                "Chore Awaiting Approval!🧐",
                                `${loggedInData.name} completed chore "${chore.title}" and needs your review.`
                            )
                        );

                    if (notificationPromises.length > 0) {
                        Promise.allSettled(notificationPromises).catch(err => {
                            console.log('Parent notification error (non-blocking):', err);
                        });
                    }
                } catch (notifError) {
                    console.error('Notification setup error (non-blocking):', notifError);
                }
                // updateChore({ _id: id, stage: "complete", stageDate: dayjs().toISOString(), kidComments })
                //     .then(() => {
                //         // Wrap notifications in try-catch so they don't block success
                //         try {
                //             // Send push notifications to all parents
                //             const notificationPromises = loggedInData.family.parents
                //                 .filter(parent => parent.notifications == true)
                //                 .flatMap(parent => parent.pushTokens || [])
                //                 .map(token =>
                //                     sendPush(
                //                         parent._id,
                //                         token,
                //                         "Chore Awaiting Approval!🧐",
                //                         `${loggedInData.name} completed chore "${chore.title}" and needs your review.`
                //                     )
                //                 );

                //             // Fire and forget notifications (don't block the user)
                //             if (notificationPromises.length > 0) {
                //                 Promise.allSettled(notificationPromises)
                //                     .then(results => {
                //                         const failed = results.filter(r => r.status === 'rejected');
                //                         if (failed.length > 0) {
                //                             console.log('Some parent notifications failed:', failed);
                //                         }
                //                     })
                //                     .catch(err => {
                //                         console.log('Notification error (non-blocking):', err);
                //                     });
                //             }
                //         } catch (notifError) {
                //             console.error('Notification setup error (non-blocking):', notifError);
                //         }

                Toast.show({ type: 'success', text1: "Chore completed!" })
                navigation.goBack()
            })
            .catch((error) => {
                console.log("completeChore error:", error)
                setApiErrors(prev => ({ ...prev, completeChore: "Unable to complete chore." }))
                Toast.show({ type: 'error', text1: "Unable to complete chore." })
                setIsButtonLoading(false)
            })
    }

    const takeAfterPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                "Camera permission required",
                "Please enable camera access in your phone's settings.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
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
            storePhotos(uri)
                .then((res) => {
                    setChore(prev => ({ ...prev, afterPic: res }))
                    updateChore({ _id: id, afterPic: res })
                        .catch((error) => {
                            console.log("addAfterImageToChore error:", error)
                            setApiErrors(prev => ({ ...prev, addAfterImageToChore: "Unable to add after image to chore." }))
                            Toast.show({ type: 'error', text1: "Unable to add after image to chore." })
                        })
                })
                .catch((error) => {
                    console.log("addAfterImage error:", error)
                    setApiErrors(prev => ({ ...prev, addAfterImage: "Unable to save after image." }))
                    Toast.show({ type: 'error', text1: "Unable to save after image." })
                })

            handleComplete()
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(prev => ({ ...prev, complete: false }))}
        >
            <View className="flex-1 justify-center items-center bg-transparent">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(68, 73, 85, 0.5)' }}
                    />
                </TouchableWithoutFeedback>

                <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[90%]">
                    <View className="flex-row items-center mb-6">
                        <Pressable
                            hitSlop={20}
                            onPress={() => setVisible(prev => ({ ...prev, complete: false }))}
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
                        className={`
                            p-[10px] items-center justify-center bg-[#84A99D] rounded-full w-full
                            ${isButtonLoading ? 'opacity-50' : ''}
                        `}
                        onPress={!isButtonLoading ? takeAfterPhoto : null}
                        disabled={isButtonLoading}
                    >
                        <BrandBoldText className="text-darkPrimaryText text-[16px]">
                            {!isButtonLoading ? "Submit after photo" : "Loading..."}
                        </BrandBoldText>
                    </Pressable>

                    {!needsPics &&
                        <Pressable
                            className={`
                                p-[10px] items-center justify-center bg-[#455C56] rounded-full w-full mt-4
                                ${isButtonLoading ? 'opacity-50' : ''}
                            `}
                            onPress={!isButtonLoading ? handleComplete : null}
                            disabled={isButtonLoading}
                        >
                            <BrandBoldText className="text-darkPrimaryText text-[16px]">
                                {!isButtonLoading ? "Complete without photo" : "Loading..."}
                            </BrandBoldText>
                        </Pressable>
                    }
                </View>
            </View>
        </Modal>
    )
}