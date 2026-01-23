import { Pressable, ScrollView, View } from "react-native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { useCallback, useEffect, useState } from "react"
import { getChoresByParents } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import dayjs from "dayjs"
import { useLogin } from "../../context/UserContext"
import { ForwardArrow } from "../../components/icons/ForwardArrow"
import { SquareIcon } from "../../components/icons/SquareIcon"
import utc from 'dayjs/plugin/utc';
import { ViewCalendarIcon } from "../../components/icons/ViewCalendarIcon"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { RecentActivityIcon } from "../../components/icons/RecentActivityIcon"
import relativeTime from "dayjs/plugin/relativeTime";
import { LargeSquareIcon } from "../../components/icons/LargeSquareIcon"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { KidNavBar } from "../../components/KidNavBar"
import DateTimePickerModal from 'react-native-modal-datetime-picker'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

export const Dashboard = () => {

    const [viewCalendarChores, setViewCalendarChores] = useState(false)
    const [viewCalendar, setViewCalendar] = useState(false)
    const [date, setDate] = useState(new Date())
    const [apiErrors, setApiErrors] = useState({})
    const [calendarChores, setCalendarChores] = useState([])
    const [loading, setLoading] = useState("Loading recent activity...")
    const [recentActivityChores, setRecentActivityChores] = useState([])
    const [allChoresByParents, setAllChoresByParents] = useState([])

    const { loggedInData, registerForPushNotifications, firstMount, setFirstMount } = useLogin()
    const navigation = useNavigation()

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate)
        setViewCalendarChores(true)
        setViewCalendar(false)

        const filteredChores = allChoresByParents
            .filter(chore => dayjs(chore.dueDate).local().isSame(dayjs(selectedDate).local(), "day"))
            .sort((a, b) => dayjs(b.dueDate).valueOf() - dayjs(a.dueDate).valueOf())

        setCalendarChores(filteredChores)
    }

    // after logging in, app registers for push and saves push token to user doc.
    useEffect(() => {
        if (firstMount) {
            registerForPushNotifications()
            setFirstMount(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            setLoading("Loading recent activity...")
            setApiErrors({})
            setDate(new Date())
            setViewCalendarChores(false)
            getChoresByParents(loggedInData.family.parents.map(p => p._id))
                .then((res) => {

                    setAllChoresByParents(res)

                    const now = dayjs().local()
                    const twentyFourHoursAgo = now.subtract(24, "hour")

                    const recentChores = res.filter((chore) =>
                        dayjs(chore.stageDate).local().isAfter(twentyFourHoursAgo) ||
                        (chore.dateEdited && dayjs(chore.dateEdited).local().isAfter(twentyFourHoursAgo)) ||
                        (chore.dueDate && dayjs(chore.dueDate).local().isBefore(now) && dayjs(chore.dueDate).local().isAfter(twentyFourHoursAgo))
                    )

                    const filteredChores = recentChores.map((chore) => {
                        const due = dayjs(chore.dueDate).local()
                        const stages = [
                            chore.stage === "incomplete" ? { stage: "Assigned", date: dayjs(chore.stageDate).local() } : null,
                            chore.stage === "complete" ? { stage: "Awaiting review", date: dayjs(chore.stageDate).local() } : null,
                            chore.stage === "approved" ? { stage: "Approved", date: dayjs(chore.stageDate).local() } : null,
                            chore.stage === "rejectedUnassigned" ? { stage: "Rejected", date: dayjs(chore.stageDate).local() } : null,
                            chore.stage === "rejectedReassigned" ? { stage: "Rejected and reassigned", date: dayjs(chore.stageDate).local() } : null,
                            chore.dateEdited ? { stage: "Edited", date: dayjs(chore.dateEdited).local() } : null,
                            (["incomplete", "rejectedUnassigned", "rejectedReassigned"].includes(chore.stage)
                                && due.isBefore(now) && due.isAfter(twentyFourHoursAgo))
                                ? { stage: "Became overdue", date: due }
                                : null
                        ].filter(item => item && item.date)

                        const mostRecent = stages.reduce((a, b) => (a.date.isAfter(b.date) ? a : b));

                        return { ...chore, recentStage: mostRecent.stage, recentDate: mostRecent.date.toDate() }
                    })

                    const seenTemplates = new Set()
                    const uniqueByTemplate = filteredChores.filter(chore => {
                        if (chore.templateId) {
                            if (seenTemplates.has(chore.templateId)) return false
                            seenTemplates.add(chore.templateId)
                            return true
                        }
                        return true
                    })

                    const sorted = uniqueByTemplate.sort(
                        (a, b) => dayjs(b.recentDate).valueOf() - dayjs(a.recentDate).valueOf()
                    )
                    setRecentActivityChores(sorted)
                })
                .catch((error) => {
                    console.log("getChoresByParents error:", error)
                    setApiErrors(prev => ({ ...prev, getChoresByParents: "Unable to get chore information." }))
                    Toast.show({ type: 'error', text1: "Unable to get chore information." })
                })
                .finally(() => setLoading(false))
        }, [])
    )

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <Header />

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
            >
                Dashboard
            </BrandBoldText>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-[16px] flex-1"
            >
                <Pressable
                    className="py-[25px] px-[25px] rounded-3xl items-center justify-between
                        bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-row"
                    onPress={() => setViewCalendar(true)}
                >
                    <View className="flex-row">
                        <ViewCalendarIcon />

                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            View chores by due date
                        </BrandBoldText>
                    </View>
                </Pressable>

                {viewCalendarChores &&
                    <View className="flex-row justify-between items-center">
                        <BrandBoldText
                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-2 my-2"
                        >
                            Due {dayjs(date).local().format("dddd, MMMM D")}
                        </BrandBoldText>

                        <Pressable
                            hitSlop={20}
                            onPress={() => setViewCalendarChores(false)}
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
                            onPress={() => navigation.navigate("ViewChore", { id: chore._id })}
                            className="flex-row w-full my-3 bg-[#9FB6AE]
                                    dark:bg-[#2F3339] rounded-3xl p-4"
                            key={chore._id}
                        >
                            <View className="flex-1">
                                <View className="flex-row">
                                    <SquareIcon />

                                    <View className="flex-1">
                                        <BrandBoldText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mb-2 ms-3"
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {chore.title}
                                        </BrandBoldText>
                                    </View>
                                </View>

                                <View className="flex-row items-center mb-2">
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px]"
                                    >
                                        {`${chore.worker.name} • `}
                                    </BrandText>

                                    <View className={`rounded-full py-1 px-3
                                            ${chore.stage === "approved"
                                            ? "bg-[#9FB6AE] dark:bg-[#B3EAD3]" : ""}
                                            ${chore.stage === "complete"
                                            || chore.stage === "incomplete"
                                            ? "bg-[#FDBB74]" : ""}
                                            ${chore.stage === "rejectedUnassigned"
                                            || chore.stage === "rejectedReassigned"
                                            ? "bg-[#FF5757]" : ""}`}
                                    >
                                        <BrandBoldText
                                            className="text-[12px] text-[#111215]"
                                        >
                                            {chore.stage === "incomplete" ? "Incomplete"
                                                : chore.stage === "complete" ? "Awaiting Review"
                                                    : chore.stage === "approved" ? "Approved"
                                                        : chore.stage === "rejectedReassigned" ? "Rejected and reassigned"
                                                            : "Rejected"
                                            }
                                        </BrandBoldText>
                                    </View>
                                </View>

                                {(dayjs(chore.dueDate).isBefore(dayjs()) && (chore.stage === "incomplete" || chore.stage === "rejectedReassigned"))
                                    ?
                                    <BrandBoldText
                                        className="text-[#F40000] text-[10px]"
                                    >
                                        Overdue! Due by {dayjs(chore.dueDate).format("h:mma")}
                                    </BrandBoldText>

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

                    : viewCalendarChores && apiErrors.getChoresByParents ?
                        <BrandText
                            className="text-red-500 text-[16px] m-2"
                        >
                            {apiErrors.getChoresByParents}
                        </BrandText>

                        : viewCalendarChores &&
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] m-2"
                        >
                            No chores due on this day
                        </BrandText>
                }

                {(allChoresByParents.length > 0 || !loggedInData.isParent)
                    ?
                    <View className="p-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                        <View className="flex-row items-center justify-between w-full">
                            <View className="items-center flex-row">
                                <RecentActivityIcon />

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
                                    onPress={() => navigation.navigate("ViewChore", { id: chore._id })}
                                    key={chore._id}
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-1 mr-2">
                                            <BrandBoldText
                                                className="dark:text-[#ECEDEE] text-lightPrimaryText text-[14px]"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {chore.title}
                                            </BrandBoldText>
                                        </View>

                                        <BrandText
                                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                        >
                                            {dayjs(chore.recentDate).fromNow()}
                                        </BrandText>
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <View className="rounded-full bg-[#84A99D]
                                                    me-3 aspect-square h-[20px] justify-center dark:bg-darkButton"
                                        >
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
                                                    ${chore.recentStage === "Assigned"
                                                || chore.recentStage === "Edited"
                                                || chore.recentStage === "Approved"
                                                ? "bg-[#9FB6AE] dark:bg-[#B3EAD3]" : ""}
                                                    ${chore.recentStage === "Awaiting review"
                                                ? "bg-[#FDBB74]" : ""}
                                                    ${chore.recentStage === "Rejected"
                                                || chore.recentStage === "Rejected and reassigned"
                                                || chore.recentStage === "Became overdue"
                                                ? "bg-[#FF5757]" : ""}`}
                                        >
                                            <BrandBoldText
                                                className="text-[12px] text-[#111215]"
                                            >
                                                {chore.recentStage}
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

                    : loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] mt-6"
                        >
                            {loading}
                        </BrandText>

                        : apiErrors.getChoresByParents ?
                            <BrandText
                                className="text-red-500 text-[16px] mt-6"
                            >
                                {apiErrors.getChoresByParents}
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
                                            Next step:{" "}
                                            <BrandText>
                                                Follow the prompts to add details to your chore. Once submitted,
                                                your kid will receive a notification with the chore details.
                                            </BrandText>
                                        </BrandBoldText>
                                    </View>
                                </View>

                                <View className="flex-1 items-center w-full mt-[20px] mb-[50px]">
                                    <LargeSquareIcon />

                                    <BrandText className="text-[16px] text-[#737780] dark:text-[#A1A4AA] mt-[20px]">
                                        No chores added yet
                                    </BrandText>
                                </View>
                            </View>
                }

            </ScrollView>

            {loggedInData.isParent ? <ParentNavBar /> : <KidNavBar />}

            <DateTimePickerModal
                isVisible={viewCalendar}
                mode="date"
                date={date}
                onConfirm={handleDateChange}
                onCancel={() => setViewCalendar(false)}
                minimumDate={dayjs().subtract(1, "month").toDate()}
                maximumDate={dayjs().add(1, "month").toDate()}
                display="inline"
            />
        </View>
    )
}