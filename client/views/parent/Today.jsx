import { useNavigation } from "@react-navigation/native"
import { useLogin } from "../../context/UserContext"
import { getChoresByParents } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import { Pressable, ScrollView, View } from "react-native"
import { Header } from "../../components/Header"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { ParentNavBar } from "../../components/ParentNavBar"
import { ForwardArrow } from "../../components/icons/ForwardArrow"
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {SquareIcon} from "../../components/icons/SquareIcon"

dayjs.extend(utc);

export const Today = () => {

    const [apiErrors, setApiErrors] = useState({})
    const [chores, setChores] = useState([])
    const [loading, setLoading] = useState("Loading chores...")

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    useEffect(() => {
        getChoresByParents(loggedInData.family.parents.map(p => p._id))
            .then((res) => {
                const choresDueToday = res.filter((chore) =>
                    dayjs(chore.dueDate).local().isSame(dayjs(), 'day') &&
                    ['incomplete', 'rejected'].includes(chore.stage)
                )
                .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
                setChores(choresDueToday)
            })
            .catch ((error) => {
                console.log("getChoresByParents error:", error)
                setApiErrors(prev => ({...prev, getChoresByParents: "Unable to get chore information."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to get chore information."
                })
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <View>
                <Header />
                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[36px] px-[16px]"
                >
                    Today's overview
                </BrandBoldText>
                <BrandText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px]"
                >
                    Check out what's due today
                </BrandText>
            </View>

            {apiErrors.getChoresByParents && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.getChoresByParents}
                </BrandText>
            )}

            {chores.length > 0
                ?
                    <ScrollView
                        showsVerticalScrollIndicator={true}
                        className="px-[16px] mt-4 flex-1"
                    >
                        {chores.map((chore) => (
                            <Pressable
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                className="flex-row w-full my-3 border border-lightPrimaryText
                                    dark:bg-[#2F3339] rounded-xl p-4"
                                key={chore._id}
                            >
                                <View className="flex-1">
                                    <View className="flex-row">
                                        <SquareIcon />
                                        <BrandBoldText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mb-2 ms-3"
                                        >
                                            {chore.title}
                                        </BrandBoldText>
                                    </View>
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px] mb-2"
                                    >
                                        {chore.worker?.name}
                                    </BrandText>
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[10px]"
                                    >
                                        Due by {dayjs(chore.dueDate).format("h:mma")}
                                    </BrandText>
                                </View>
                                <View className="justify-center">
                                    <ForwardArrow />
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                : loading ?
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText my-4 px-[16px] flex-1"
                    >
                        {loading}
                    </BrandText>

                :
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] my-4 px-[16px] flex-1"
                    >
                        No chores due today
                    </BrandText>
            }
            
            <ParentNavBar />
        </View>
    )
}