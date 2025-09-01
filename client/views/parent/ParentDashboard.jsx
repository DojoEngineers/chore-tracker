import { Pressable, ScrollView, View } from "react-native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { HighlightedTodayIcon } from "../../components/icons/HighlightedTodayIcon"
import { BrandText } from "../../components/text/BrandText"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from "react"
import { getChoresByParents } from "../../services/chore.service"
import Toast from "react-native-toast-message"
import dayjs from "dayjs"
import { useLogin } from "../../context/UserContext"
import { ForwardArrow } from "../../components/icons/ForwardArrow"
import { SquareIcon } from "../../components/icons/SquareIcon"
import { NotificationService } from "../../services/notification.service"
import Constants from 'expo-constants';

export const ParentDashboard = () => {

    const [viewChores, setViewChores] = useState(false)
    const [date, setDate] = useState(new Date())
    const [apiErrors, setApiErrors] = useState({})
    const [chores, setChores] = useState([])
    const [loading, setLoading] = useState("Loading chores...")
    const [openDate, setOpenDate] = useState(false)

    const { loggedInData, user, pushToken } = useLogin()

    const handleDateChange = (selectedDate) => {
        if (!selectedDate) return
        setDate(selectedDate)
        setOpenDate(false)
        setViewChores(true)

        getChoresByParents(loggedInData.family.parents.map(p => p._id))
            .then((res) => {
                const filteredChores = res.filter(chore =>
                    chore.stage === "complete"
                        ? dayjs(chore.dateCompleted).local().isSame(dayjs(selectedDate).local(), "day")
                        : dayjs(chore.dueDate).local().isSame(dayjs(selectedDate).local(), "day")
                )
                setChores(filteredChores)
            })
            .catch((error) => {
                console.log("getChoresByParents error:", error)
                setApiErrors(prev => ({ ...prev, getChoresByParents: "Unable to get chore information." }))
                Toast.show({
                    type: 'error',
                    text1: "Unable to get chore information."
                })
            })
            .finally(() => setLoading(false))
    }

    const testPush = async () => {
        // this runs when the button is pressed
        console.log("in testpush")
        console.log("push", pushToken)
        // try {
        //     await fetch(`${Constants.expoConfig.extra.BACKEND_API_URL}/notify`, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ pushToken, choreName: "Dishes" }),
        //     });
        // }
        // catch (error) {
        //     console.log("view error", error)

        // }
    };

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <Header />

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
            >
                Dashboard
            </BrandBoldText>
            <Pressable className="bg-blue-400 p-5" onPress={() => { testPush() }}>
                <BrandBoldText>Notify me</BrandBoldText>
            </Pressable>

            <ScrollView
                showsVerticalScrollIndicator={true}
                className="px-[16px]"
            >
                <View
                    className="py-[20px] px-[20px] rounded-3xl items-center justify-between
                        bg-[#ECDBC7] dark:bg-[#2F3339] w-full my-3 flex-row"
                >
                    <View className="flex-row">
                        <HighlightedTodayIcon width={18} />
                        <Pressable onPress={() => { setOpenDate(true) }}>
                            <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                                View Calendar
                            </BrandBoldText>
                        </Pressable>

                    </View>
                    {openDate &&
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            minimumDate={dayjs().subtract(1, "month").toDate()}
                            maximumDate={dayjs().add(1, "month").toDate()}
                            onChange={(e, selectedDate) => { handleDateChange(selectedDate) }}
                        />}
                </View>

                {apiErrors.getChoresByParents && (
                    <BrandText className="text-red-500 text-center">
                        {apiErrors.getChoresByParents}
                    </BrandText>
                )}

                {viewChores &&
                    <View className="flex-row justify-between items-center">
                        <BrandBoldText
                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-2 my-2"
                        >
                            {dayjs(date).local().format("dddd, MMMM D")}
                        </BrandBoldText>
                        <Pressable
                            hitSlop={20}
                            onPress={() => setViewChores(false)}
                            className=""
                        >
                            <BrandText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px] me-2">
                                Hide Chores
                            </BrandText>
                        </Pressable>
                    </View>
                }

                {viewChores && chores.length > 0
                    ?
                    chores.map((chore) => (
                        <Pressable
                            onPress={() => navigation.navigate("ViewChore", { id: chore._id })}
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

                                {chore.stage === "complete"
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

                    : viewChores && loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText"
                        >
                            {loading}
                        </BrandText>

                        : viewChores &&
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] m-2"
                        >
                            No chore data on this day
                        </BrandText>
                }

            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0">
                <ParentNavBar />
            </View>
        </View>
    )
}