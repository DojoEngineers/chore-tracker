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

export const DeleteKid = ({route}) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedKid, setSelectedKid] = useState({})
    const [ apiErrors, setApiErrors ] = useState({})

    const {kids} = route.params
    const navigation = useNavigation()
    const {setLoggedInData} = useLogin()

    const handleDelete = () => {
        updateUser({id: selectedKid._id, isActive: false})
            .then( (res) => { 
                Toast.show({
                    type: 'success',
                    text1: `${selectedKid.name} successfully deleted!`
                })
                setLoggedInData((prev) => ({
                    ...prev, family: {...prev.family, children: prev.family.children
                    .filter((kid) => kid._id !== selectedKid._id)
                }}))
                navigation.goBack()
            })
            .catch( error => {
                console.log("updateUser error:", error)
                setApiErrors(prev => ({...prev, updateUser: "Unable to delete account."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to delete account."
                })
            })
    }

    return(
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <View className="flex-1 items-center px-[16px]">
                <View className="flex-row mt-[75px]">
                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Delete a kid
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
                    Please select which kid you would like to delete.
                    {"\n"}WARNING! This cannot be undone.
                </BrandBoldText>

                <View className="flex-1 z-10">
                    <ScrollView
                        contentContainerClassName="items-center flex-grow"
                        showsVerticalScrollIndicator={true}
                        className="flex-1"
                    >
                        {kids.map((kid) => (
                            <View key={kid._id} className="mb-8 items-center">
                                <Pressable
                                    onPress={() => {
                                        setModalVisible(true)
                                        setSelectedKid(kid)
                                    }}
                                    className="w-[207px] h-[207px] rounded-full items-center justify-center mb-2 dark:bg-[#333740] bg-[#D0D1D4]"
                                >
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[128px]"
                                    >
                                        {kid.name[0]}
                                    </BrandText>
                                </Pressable>

                                <BrandBoldText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[20px] text-center"
                                    >
                                        {kid.name}
                                </BrandBoldText>

                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                >
                                    {kid.username}
                                </BrandText>
                            </View>
                        ))}
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
                            Are you sure you want to delete {selectedKid.name}?
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