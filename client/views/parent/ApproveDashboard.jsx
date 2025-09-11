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

export const ApproveDashboard = () => {

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
                    ['rejected', 'approved'].includes(chore.stage) &&
                    (chore.dateRejected && dayjs(chore.dateRejected).isAfter(twentyFourHoursAgo)) ||
                    (chore.dateApproved && dayjs(chore.dateApproved).isAfter(twentyFourHoursAgo))
                )

                const filteredRecentActivityChores = recentChores.map((chore) => {
                    const stages = [
                        { stage: "Approved", date: chore.dateApproved },
                        { stage: "Rejected", date: chore.dateRejected },
                    ].filter(item => item.date && dayjs(item.date).isAfter(twentyFourHoursAgo))

                    const mostRecent = stages.reduce((a, b) =>
                        dayjs(a.date).isAfter(dayjs(b.date)) ? a : b
                    )

                    return {...chore, recentStage: mostRecent.stage, recentDate: mostRecent.date}
                })
                .sort((a, b) => dayjs(b.recentDate).valueOf() - dayjs(a.recentDate).valueOf())
                setRecentActivityChores(filteredRecentActivityChores)
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
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mt-[30px]"
            >
                Pending Reviews
            </BrandBoldText>

            {apiErrors.getChoresByParents && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.getChoresByParents}
                </BrandText>
            )}
            
            {pendingChores.length > 0
                ?
                    <View>
                        <ScrollView
                            horizontal
                            className="px-[16px] my-4"
                            showsVerticalScrollIndicator={true}
                        >
                            {pendingChores.map(chore => (
                                <Pressable
                                    key={chore._id}
                                    className="w-[96px] h-[123px] rounded-3xl dark:bg-[#2F3339] bg-[#9FB6AE] mr-3 justify-between"
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                >
                                    <View
                                        className="bg-[#FEDBB1] w-[49px] h-[14px] items-center justify-center rounded-r mt-[20px] px-1"
                                    >
                                        <BrandBoldText
                                            className="text-[#431507] text-[10px]"
                                            numberOfLines={1}
                                            adjustsFontSizeToFit={true}
                                            minimumFontScale={0.5}
                                        >
                                            {chore.worker.name}
                                        </BrandBoldText>
                                    </View>
                                    <BrandBoldText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px] text-center px-1"
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {chore.title}
                                    </BrandBoldText>
                                    <View
                                        className="border-t-2 border-[#FEDBB1] h-[28px] justify-center items-center
                                            bg-[#C2430C] dark:bg-[#EA5A0C] rounded-b-3xl"
                                    >
                                        <BrandBoldText
                                            className="text-[#FFF7ED] text-[12px]"
                                        >
                                            Review
                                        </BrandBoldText>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                : loading ?
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-4 px-[16px]"
                    >
                        {loading}
                    </BrandText>
                :
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-4 px-[16px]"
                    >
                        No pending chores
                    </BrandText>
            }

            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    className="flex-1"
                >
                    <View className="py-[25px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] my-3 mx-[16px]">
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
                                                {dayjs(chore.recentDate).fromNow()}
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
                                            <BrandText
                                                className={`
                                                    text-[12px]
                                                    ${chore.recentStage === "Approved" ? "text-[#455C56] dark:text-[#B3EAD3]" : ""}
                                                    ${chore.recentStage === "Rejected" ? "text-[#FF5757]" : ""}
                                                `}
                                            >
                                                {chore.recentStage}
                                            </BrandText>
                                        </View>
                                    </Pressable>
                                ))
                
                            : loading ?
                                <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mt-6"
                                >
                                    {loading}
                                </BrandText>
                            :
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mt-6"
                                    >
                                    No recent activity
                                </BrandText>
                        }
                    </View>
                </ScrollView>
            </View>

            <ParentNavBar />
        </View>
    )
}