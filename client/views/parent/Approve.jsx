import { Pressable, ScrollView, View } from "react-native"
import { Header } from "../../components/Header"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { ParentNavBar } from "../../components/ParentNavBar"
import { useEffect, useState } from "react"
import { getChoresByParents } from "../../services/chore.service"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import dayjs from "dayjs"
import {ApproveAndRejectIcon} from "../../components/icons/ApproveAndRejectIcon"
import { HorizontalChoreScroll } from "../../components/HorizontalChoreScroll"

export const Approve = () => {

    const [apiErrors, setApiErrors] = useState({})
    const [loading, setLoading] = useState("Loading chores...")
    const [recentActivityChores, setRecentActivityChores] = useState([])
    const [pendingChores, setPendingChores] = useState([])

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    useEffect(() => {
        getChoresByParents(loggedInData.family.parents.map(p => p._id))
            .then((res) => {
                // Pending Chores
                const filteredPendingChores = res.filter(chore => 
                    chore.stage === "complete"
                )
                setPendingChores(filteredPendingChores)

                // Recent Approvals and Rejections
                const twentyFourHoursAgo = dayjs().subtract(24, "hour")

                const recentChores = res.filter(chore =>
                    ['rejectedReassigned', 'rejectedUnassigned', 'approved'].includes(chore.stage) &&
                    dayjs(chore.stageDate).isAfter(twentyFourHoursAgo)
                )
                .sort((a, b) => dayjs(b.stageDate).valueOf() - dayjs(a.stageDate).valueOf())
                setRecentActivityChores(recentChores)
            })
            .catch((error) => {
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
            <Header />

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
            >
                Approve
            </BrandBoldText>

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-4"
            >
                Pending Reviews
            </BrandBoldText>

            <HorizontalChoreScroll chores={pendingChores} apiError={apiErrors.getChoresByParents}
                loading={loading} noChoreMessage="No pending chores"/>

            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    className="flex-1"
                >
                    <View className="py-[25px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] my-3 mx-[16px] flex-1">
                        <View className="flex-row items-center justify-between w-full">
                            <View className="items-center flex-row">

                                <ApproveAndRejectIcon/>

                                <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                                    Approvals and rejections
                                </BrandBoldText>
                            </View>

                            <BrandText
                                className="text-[12px] dark:text-[#ECEDEE] text-lightPrimaryText"
                                >
                                Last 24hr
                            </BrandText>
                        </View>

                        {recentActivityChores.length > 0
                            ?
                                recentActivityChores.map(chore => (
                                    <Pressable
                                        className="w-full rounded-2xl bg-lightBg dark:bg-darkBg p-3 mt-4"
                                        onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                        key={chore._id}
                                    >
                                        <View className="flex-row justify-between items-center">
                                            <BrandBoldText
                                                className="dark:text-[#ECEDEE] text-lightPrimaryText text-[14px]"
                                            >
                                                {chore.title}
                                            </BrandBoldText>

                                            <BrandText
                                                className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                            >
                                                {dayjs(chore.stageDate).fromNow()}
                                            </BrandText>
                                        </View>

                                        <View className="flex-row items-center mt-2">
                                            <View className="rounded-full bg-[#84A99D]
                                                me-3 aspect-square h-[20px] justify-center dark:bg-darkButton">
                                                <BrandBoldText className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px] text-center">
                                                    {chore.worker.name[0]}
                                                </BrandBoldText>
                                            </View>

                                            <BrandText
                                                className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px]"
                                            >
                                                {` ${chore.worker.name} • `}
                                            </BrandText>

                                            <View className={`rounded-full py-1 px-3
                                                ${chore.stage === "approved"
                                                    ? "bg-[#9FB6AE] dark:bg-[#B3EAD3]" : ""}
                                                ${chore.stage === "rejectedUnassigned"
                                                    || chore.stage === "rejectedReassigned"
                                                    ? "bg-[#FF5757]" : ""}`}
                                            >
                                                <BrandBoldText
                                                    className="text-[12px] text-[#111215]"
                                                >
                                                    {chore.stage === "approved" ? "Approved"
                                                        : chore.stage === "rejectedReassigned" ? "Rejected and reassigned"
                                                        : "Rejected"}
                                                </BrandBoldText>
                                            </View>
                                        </View>
                                    </Pressable>
                                ))
                
                            : loading ?
                                <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mt-6"
                                >
                                    {loading}
                                </BrandText>

                            : apiErrors.getChoresByParents ?
                                <BrandText
                                    className="text-red-500 text-[16px] my-4 px-[16px]"
                                >
                                    {apiErrors.getChoresByParents}
                                </BrandText>

                            :
                            <View className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-6 mt-4 justify-center">
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]"
                                    >
                                    No recent activity
                                </BrandText>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>

            <ParentNavBar />
        </View>
    )
}