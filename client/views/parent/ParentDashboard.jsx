import { Pressable, ScrollView, View } from "react-native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useEffect, useState } from "react"
import { getChoresByParents } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import dayjs from "dayjs"
import { useLogin } from "../../context/UserContext"
import { ForwardArrow } from "../../components/icons/ForwardArrow"
import { SquareIcon } from "../../components/icons/SquareIcon"
import utc from 'dayjs/plugin/utc';
import { ViewCalendarIcon } from "../../components/icons/ViewCalendarIcon"
import { useNavigation } from "@react-navigation/native"
import { RecentActivityIcon } from "../../components/icons/RecentActivityIcon"
import relativeTime from "dayjs/plugin/relativeTime";
import { LargeSquareIcon } from "../../components/icons/LargeSquareIcon"

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const ParentDashboard = () => {

    const [viewCalendarChores, setViewCalendarChores] = useState(false)
    const [viewCalendar, setViewCalendar] = useState(false)
    const [date, setDate] = useState(new Date())
    const [apiErrors, setApiErrors] = useState({})
    const [calendarChores, setCalendarChores] = useState([])
    const [loading, setLoading] = useState("Loading recent activity...")
    const [recentActivityChores, setRecentActivityChores] = useState([])
    const [allChoresByParents, setAllChoresByParents] = useState([])

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    const handleDateChange = (selectedDate) => {
        if (!selectedDate) return
        setDate(selectedDate)
        setViewCalendarChores(true)
        setViewCalendar(false)

        const filteredChores = allChoresByParents.filter(chore =>
            ['complete', 'approved'].includes(chore.stage)
            ? dayjs(chore.dateCompleted).local().isSame(dayjs(selectedDate).local(), "day")
            : dayjs(chore.dueDate).local().isSame(dayjs(selectedDate).local(), "day")
        )

        .sort((a, b) => {
            const aDate = ['complete', 'approved'].includes(a.stage)
            ? dayjs(a.dateCompleted)
            : dayjs(a.dueDate)

            const bDate = ['complete', 'approved'].includes(b.stage)
            ? dayjs(b.dateCompleted)
            : dayjs(b.dueDate)

            return aDate.valueOf() - bDate.valueOf()
        })

        setCalendarChores(filteredChores)
    }

    useEffect(() => {
        getChoresByParents(loggedInData.family.parents.map(p => p._id))
            .then((res) => {
                setAllChoresByParents(res)

                const twentyFourHoursAgo = dayjs().subtract(24, "hour")

                const recentChores = res.filter((chore) =>
                    (chore.createdAt && dayjs(chore.createdAt).isAfter(twentyFourHoursAgo)) ||
                    (chore.dateCompleted && dayjs(chore.dateCompleted).isAfter(twentyFourHoursAgo)) ||
                    (chore.dateRejected && dayjs(chore.dateRejected).isAfter(twentyFourHoursAgo)) ||
                    (chore.dateApproved && dayjs(chore.dateApproved).isAfter(twentyFourHoursAgo))
                )

                const filteredChores = recentChores.map((chore) => {
                    const stages = [
                        { stage: "Assigned", date: chore.createdAt },
                        { stage: "Awaiting review", date: chore.dateCompleted },
                        { stage: "Approved", date: chore.dateApproved },
                        { stage: "Rejected", date: chore.dateRejected },
                    ].filter(item => item.date && dayjs(item.date).isAfter(twentyFourHoursAgo))

                    const mostRecent = stages.reduce((a, b) =>
                        dayjs(a.date).isAfter(dayjs(b.date)) ? a : b
                    )

                    return {...chore, recentStage: mostRecent.stage, recentDate: mostRecent.date}
                })
                
                .sort((a, b) => dayjs(b.recentDate).valueOf() - dayjs(a.recentDate).valueOf())
                setRecentActivityChores(filteredChores)
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
                Dashboard
            </BrandBoldText>

            <ScrollView
                showsVerticalScrollIndicator={true}
                className="px-[16px] flex-1"
            >
                <Pressable
                    className="py-[25px] px-[25px] rounded-3xl items-center justify-between
                        bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-row"
                    onPress={() => setViewCalendar(true)}
                >
                    <View className="flex-row">
                        <ViewCalendarIcon/>
                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            View calendar
                        </BrandBoldText>
                    </View>
                    {viewCalendar &&
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            minimumDate={dayjs().subtract(1, "month").toDate()}
                            maximumDate={dayjs().add(1, "month").toDate()}
                            onChange={(e, selectedDate) => {handleDateChange(selectedDate)}}
                        />
                    }
                </Pressable>

                {apiErrors.getChoresByParents && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.getChoresByParents}
                    </BrandText>
                )}

                {viewCalendarChores &&
                    <View className="flex-row justify-between items-center">
                        <BrandBoldText
                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-2 my-2"
                        >
                            {dayjs(date).local().format("dddd, MMMM D")}
                        </BrandBoldText>
                        <Pressable
                            hitSlop={20}
                            onPress={() => setViewCalendarChores(false)}
                            className=""
                        >
                            <BrandText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px] me-2">
                                Hide Chores
                            </BrandText>
                        </Pressable>
                    </View>
                }

                {viewCalendarChores && calendarChores.length > 0
                    ?
                        calendarChores.map((chore) => (
                            <Pressable
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                className="flex-row w-full my-3 bg-[#9FB6AE]
                                    dark:bg-[#2F3339] rounded-3xl p-4"
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

                                    {chore.stage === "complete" || chore.stage === "approved"
                                        ?
                                            <BrandText
                                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[10px]"
                                            >
                                                Completed at {dayjs(chore.dateCompleted).format("h:mma")}
                                            </BrandText>
                                        :
                                            <BrandText
                                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[10px]"
                                            >
                                                Due by {dayjs(chore.dueDate).format("h:mma")}
                                            </BrandText>
                                    }
                                </View>

                                <View className="justify-center">
                                    <ForwardArrow />
                                </View>
                            </Pressable>
                        ))

                    : viewCalendarChores &&
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] m-2"
                        >
                            No chore data on this day
                        </BrandText>
                }

                {allChoresByParents.length > 0
                    ?
                        <View className="p-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3">
                            <View className="flex-row items-center justify-between w-full">
                                <View className="items-center flex-row">
                                    <RecentActivityIcon/>
                                    <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                                        Recent Activity
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
                                            className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-3 mt-4"
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
                                                        ${chore.recentStage === "Assigned" ? "text-lightPrimaryText dark:text-[#ECEDEE]" : ""}
                                                        ${chore.recentStage === "Awaiting review" ? "text-[#FB943C] dark:text-[#FEDBB1]" : ""}
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

                    : loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mt-6"
                        >
                            {loading}
                        </BrandText>

                    :
                        <View className="flex-1 mt-4">
                            <View className="p-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3">
                                <View className="flex-row">
                                    <SquareIcon width={21} />
                                    <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText ms-6">
                                        How to add a new chore
                                    </BrandBoldText>
                                </View>

                                <BrandText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText my-4 ms-12">
                                    First, make sure you have added at least one kid to your family in the kids tab.
                                    Then, tap the
                                        <BrandText className="text-[#57756B] dark:text-darkButton">
                                            {" "}+{" "}
                                        </BrandText>
                                    button to add a new chore.
                                </BrandText>

                                <View className="bg-[#DFE8E4] dark:bg-darkBg rounded-3xl py-4 px-5 ms-11">
                                    <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText">
                                        Next step: 
                                        <BrandText> Follow the prompts to add details to your chore. Once submitted, your kid will receive a notification with the chore details.</BrandText>
                                    </BrandBoldText>
                                </View>
                            </View>

                            <View className="flex-1 items-center w-full mt-[50px]">
                                <LargeSquareIcon />
                                <BrandText className="text-[16px] text-[#A1A4AA] dark:text-[#444955] mt-[30px]">
                                    No chores added yet
                                </BrandText>
                            </View>
                        </View>
                }

            </ScrollView>

            <ParentNavBar />
        </View>
    )
}