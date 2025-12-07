import { useNavigation } from "@react-navigation/native"
import { Modal, Pressable, ScrollView, View } from "react-native"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { useState } from "react"
import { CloseIcon } from "../../components/icons/CloseIcon"
import { updateUser } from "../../services/user.service"
import Toast from "react-native-toast-message"
import { useLogin } from "../../context/UserContext"

export const DeleteFamilyMember = ({route}) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [ apiErrors, setApiErrors ] = useState({})
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const {users, isParent} = route.params
    const navigation = useNavigation()
    const {setLoggedInData} = useLogin()

    const handleDelete = () => {
        if (isButtonLoading) return
        setIsButtonLoading(true)

        updateUser({id: selectedUser._id, isActive: false})
            .then( (res) => { 
                Toast.show({type: 'success', text1: `${selectedUser.name} successfully deleted!`})
                const key = isParent ? "parents" : "children"
                setLoggedInData((prev) => ({
                    ...prev, family: {...prev.family, [key]: prev.family[key]
                    .filter((user) => user._id !== selectedUser._id)
                }}))
                navigation.replace('Settings', {animationType: "slide_from_left"})
            })
            .catch( error => {
                console.log("updateUser error:", error)
                setApiErrors(prev => ({...prev, updateUser: "Unable to delete account."}))
                Toast.show({type: 'error', text1: "Unable to delete account."})
            })
            .finally(() => setIsButtonLoading(false))
    }

    return(
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <View className="flex-1 items-center px-[16px]">
                <View className="flex-row mt-[13%]">
                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Delete a {isParent? "parent" : "kid"}
                        </BrandBoldText>
                    </View>
                </View>

                {apiErrors.updateUser && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.updateUser}
                    </BrandText>
                )}

                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-8 text-center"
                >
                    Please select which {isParent? "parent" : "kid"} you would like to delete.
                    {"\n"}WARNING! This cannot be undone.
                </BrandBoldText>

                <View className="flex-1 z-10">
                    <ScrollView
                        contentContainerClassName="items-center flex-grow"
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        {users
                            .filter((user, index) => !(isParent && index === 0))
                            .map((user) => (
                                <View key={user._id} className="mb-8 items-center">
                                    <Pressable
                                        onPress={() => {
                                            setModalVisible(true)
                                            setSelectedUser(user)
                                        }}
                                        className="w-[207px] h-[207px] rounded-full items-center justify-center mb-2 dark:bg-[#333740] bg-[#D0D1D4]"
                                    >
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[128px]"
                                        >
                                            {user.name[0]}
                                        </BrandText>
                                    </Pressable>

                                    <BrandBoldText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[20px] text-center"
                                        >
                                            {user.name}
                                    </BrandBoldText>

                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                    >
                                        {user.username}
                                    </BrandText>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>

            </View>

            <View className="absolute bottom-0 right-0 z-0">
                <SmallBottomRightSquiggle />
            </View>

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
                    <View className="bg-[#ECEDEE] dark:bg-[#454954] p-[16px] rounded-3xl w-[250px]">
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
                            Are you sure you want to delete {selectedUser.name}?
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
        </View>
    )
}