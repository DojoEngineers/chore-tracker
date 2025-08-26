import { useEffect, useState } from "react"
import { getChoreById } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useNavigation } from "@react-navigation/native"
import { BackArrow } from "../../components/icons/BackArrow"
import dayjs from "dayjs"


export const ViewChore = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chore, setChore] = useState({})

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
    }, [])
    
    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">
        
            <View className="flex-row w-full mt-[70px] items-center mb-8">
                <Pressable
                    hitSlop={20}
                    className="ps-6 pe-8"
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

            <View>
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Created by: {chore.creator?.name}
                </BrandBoldText>
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Assigned to: {chore.worker?.name}
                </BrandBoldText>
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Repeat: {chore.repeat?.charAt(0).toUpperCase() + chore.repeat?.slice(1)}
                </BrandBoldText>
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Due Date: {dayjs(chore.dueDate).local().format("dddd, MMMM D [at] h:mma")}
                </BrandBoldText>
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                    Photos required? {chore.needsPics ? "Yes" : "No"}
                </BrandBoldText>
                {chore.details &&
                    <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText">
                        Notes: {chore.details}
                    </BrandBoldText>
                }
            </View>

            <View>
                <Pressable
                    className="border"
                >
                    <BrandBoldText
                        className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText"
                    >
                        Edit
                    </BrandBoldText>
                </Pressable>
                <Pressable
                    className="border"
                >
                    <BrandBoldText
                        className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText"
                    >
                        Delete
                    </BrandBoldText>
                </Pressable>
            </View>
        </View>
    )
}