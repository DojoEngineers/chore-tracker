import { Modal, Pressable, View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { BrandText } from "./text/BrandText"
import { CloseIcon } from "./icons/CloseIcon"
import { updateChore } from "../services/chore.service"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { useCallback, useState } from "react"

export const DeleteModal = ({visible, setVisible, setApiErrors, id, setRefreshTrigger}) => {

    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            setIsButtonLoading(false)
        }, [])
    )

    const handleDelete = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        updateChore({_id: id, isActive: false})
            .then( () => { 
                Toast.show({type: 'success', text1: "Chore successfully deleted!"})
                setVisible(prev => ({...prev, delete: false}))
                if (setRefreshTrigger) {
                    setRefreshTrigger(prev => prev + 1)
                    setIsButtonLoading(false)
                }
                else navigation.goBack()
            })
            .catch( error => {
                console.log("deleteChore error:", error)
                setApiErrors(prev => ({...prev, deleteChore: "Unable to delete chore."}))
                Toast.show({type: 'error', text1: "Unable to delete chore."})
                setIsButtonLoading(false)
            })
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(prev => ({...prev, delete: false}))}
        >
            <View
                className="flex-1 justify-center items-center"
                style={{backgroundColor: 'rgba(68, 73, 85, 0.5)'}}
            >
                <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[250px]">
                    <View className="flex-row items-center">
                        <Pressable
                            hitSlop={20}
                            className="pe-4 me-6"
                            onPress={() => setVisible(prev => ({...prev, delete: false}))}
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
                        className={`
                            p-[10px] items-center justify-center bg-[#F40000] rounded-full w-full
                            ${isButtonLoading ? 'opacity-50' : ''}
                        `}
                        onPress={!isButtonLoading ? handleDelete : null}
                        disabled={isButtonLoading}
                    >
                        <BrandBoldText className="text-darkPrimaryText text-[16px]">
                            {!isButtonLoading ? "Delete" : "Loading..."}
                        </BrandBoldText>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}