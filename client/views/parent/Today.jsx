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
                .sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)))
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

            <ScrollView
                showsVerticalScrollIndicator={true}
                className="px-[16px] mt-4"
            >
                {chores.length > 0
                    ?
                        chores.map((chore) => (
                            <Pressable
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                className="flex-row w-full my-3 border border-lightPrimaryText 
                                    dark:border-darkPrimaryText rounded-lg p-4"
                                key={chore._id}
                            >
                                <View className="flex-1">
                                    <BrandBoldText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mb-2"
                                    >
                                        {chore.title}
                                    </BrandBoldText>
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
                        ))

                    : loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText"
                        >
                            {loading}
                        </BrandText>

                    :
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                        >
                            No chores due today
                        </BrandText>
                }
            </ScrollView>
            
            <ParentNavBar />
        </View>
    )
}