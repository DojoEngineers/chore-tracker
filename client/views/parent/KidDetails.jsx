import { useNavigation } from "@react-navigation/native"
import { Pressable, ScrollView, Text, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useEffect, useState } from "react"
import {getChoresByWorker} from "../../services/chore.service.js"
import Toast from "react-native-toast-message"
import { BrandText } from "../../components/text/BrandText"
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ParentNavBar } from "../../components/ParentNavBar.jsx"
import utc from 'dayjs/plugin/utc';
import {DueTodayIcon} from "../../components/icons/DueTodayIcon"
import {CheckIcon} from "../../components/icons/CheckIcon"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(isSameOrBefore)

export const KidDetails = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chores, setChores] = useState({today: [], thisWeek: [], completed: []})
    const [loading, setLoading] = useState("loading chores...")

    const navigation = useNavigation()
    const { kid } = route.params

    useEffect(() => {
        getChoresByWorker(kid._id)
            .then((res) => {
                // Today's chores
                const today = res.filter((chore) =>
                    ['incomplete', 'rejectedReassigned'].includes(chore.stage) &&
                    dayjs(chore.dueDate).local().isSameOrBefore(dayjs().local(), 'day')
                )
                .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())

                // Rest of the week chores (excluding today)
                const thisWeek = res.filter((chore) =>
                    dayjs(chore.dueDate).local().isBetween(dayjs().add(1, 'day').startOf('day'), dayjs().endOf('week'), null, '[]') &&
                    ['incomplete', 'rejectedReassigned'].includes(chore.stage)
                )
                .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())

                // Completed chores
                const completed = res
                .filter(chore => ['complete', 'approved'].includes(chore.stage))
                .sort((a, b) => {
                    const aDate = a.dateApproved || a.dateCompleted
                    const bDate = b.dateApproved || b.dateCompleted

                    return dayjs(bDate).valueOf() - dayjs(aDate).valueOf()
                })

                // Set chores in state
                setChores(prev => ({...prev, today, thisWeek, completed}))
            })
            .catch ((error) => {
                console.log("getChoresByWorker error:", error)
                setApiErrors(prev => ({...prev, getChoresByWorker: "Unable to get chore information."}))
                Toast.show({
                    type: 'error',
                    text1: "Unable to get chore information."
                })
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <View className="flex-row mt-[75px] items-center ps-[20px] mb-2">
                <Pressable
                    hitSlop={20}
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow/>
                </Pressable>
            
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText ml-8">
                    {kid.name}
                </BrandBoldText>
            </View>

            {apiErrors.getChoresByWorker && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.getChoresByWorker}
                </BrandText>
            )}

            <ScrollView
                showsVerticalScrollIndicator={true}
                className="px-[16px] flex-1"
            >
                <View className="py-[15px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                    <View className="flex-row items-center w-full">
                        <DueTodayIcon/>
                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            Due Today
                        </BrandBoldText>
                    </View>

                    {chores.today.length > 0
                        ?
                            chores.today.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-3 mt-4"
                                    key={chore._id}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                        >
                                            {chore.title}
                                        </BrandText>

                                        {dayjs(chore.dueDate).isBefore(dayjs())
                                            ?
                                                <BrandText
                                                    className="text-[#FF5757] text-[12px]"
                                                >
                                                    Overdue!
                                                </BrandText>
                                            :
                                                <BrandText
                                                    className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                                >
                                                    Due by {dayjs(chore.dueDate).local().format("h:mma")}
                                                </BrandText>
                                        }
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <View className="rounded-full bg-[#84A99D]
                                            me-3 aspect-square h-[20px] justify-center dark:bg-darkButton">
                                            <BrandBoldText className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px] text-center">
                                                {kid.name[0]}
                                            </BrandBoldText>
                                        </View>
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px]"
                                        >
                                            {` ${kid.name} • `}
                                        </BrandText>
                                        <BrandText
                                            className={`
                                                text-[12px] 
                                                ${chore.stage === "incomplete" ? "text-lightPrimaryText dark:text-[#ECEDEE]" : ""}
                                                ${chore.stage === "rejectedReassigned" ? "text-[#FF5757]" : ""}
                                            `}
                                        >
                                            {chore.stage === "incomplete" ? "Incomplete" : "Rejected and reassigned"}
                                        </BrandText>

                                    </View>
                                    
                                </Pressable>
                            ))

                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                {loading}
                            </BrandText>

                        :
                            <View>
                                <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                                    >
                                        No chores due today
                                    </BrandText>
                            </View>
                    }
                </View>

                <View className="py-[15px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                    <View className="flex-row items-center w-full">
                        <DueTodayIcon/>
                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            Due by end of week
                        </BrandBoldText>
                    </View>

                    {chores.thisWeek.length > 0
                        ?
                            chores.thisWeek.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-3 mt-4"
                                    key={chore._id}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                        >
                                            {chore.title}
                                        </BrandText>
                                        <BrandText
                                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                        >
                                            Due on {dayjs(chore.dueDate).local().format("dddd")}
                                        </BrandText>
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <View className="rounded-full bg-[#84A99D]
                                            me-3 aspect-square h-[20px] justify-center dark:bg-darkButton">
                                            <BrandBoldText className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px] text-center">
                                                {kid.name[0]}
                                            </BrandBoldText>
                                        </View>
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px]"
                                        >
                                            {` ${kid.name} • `}
                                        </BrandText>
                                        <BrandText
                                            className={`
                                                text-[12px] 
                                                ${chore.stage === "incomplete" ? "text-lightPrimaryText dark:text-[#ECEDEE]" : ""}
                                                ${chore.stage === "rejectedReassigned" ? "text-[#FF5757]" : ""}
                                            `}
                                        >
                                            {chore.stage === "incomplete" ? "Incomplete" : "Rejected and reassigned"}
                                        </BrandText>

                                    </View>
                                    
                                </Pressable>
                            ))

                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText  text-[14px] mt-4"
                            >
                                {loading}
                            </BrandText>

                        :
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                No chores due by end of week
                            </BrandText>
                    }
                </View>

                <View className="py-[15px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                    <View className="flex-row items-center w-full">
                        <CheckIcon/>
                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            Completed chore history
                        </BrandBoldText>
                    </View>

                    {chores.completed.length > 0
                        ?
                            chores.completed.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-3 mt-4"
                                    key={chore._id}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                        >
                                            {chore.title}
                                        </BrandText>
                                        <BrandText
                                            className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                        >
                                            { chore.stage === "complete"
                                                ?
                                                    dayjs(chore.dateCompleted).local().format("MMMM D")
                                                :
                                                    dayjs(chore.dateApproved).local().format("MMMM D")
                                            }
                                        </BrandText>
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <View className="rounded-full bg-[#84A99D]
                                            me-3 aspect-square h-[20px] justify-center dark:bg-darkButton">
                                            <BrandBoldText className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px] text-center">
                                                {kid.name[0]}
                                            </BrandBoldText>
                                        </View>
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-[#ECEDEE] text-[12px]"
                                        >
                                            {` ${kid.name} • `}
                                        </BrandText>
                                        <BrandText
                                            className={`
                                                text-[12px] 
                                                ${chore.stage === "complete" ? "text-[#FB943C] dark:text-[#FEDBB1]" : ""}
                                                ${chore.stage === "approved" ? "text-[#455C56] dark:text-[#B3EAD3]" : ""}
                                            `}
                                        >
                                            {chore.stage === "complete" ? "Awaiting Review" : "Approved"}
                                        </BrandText>

                                    </View>
                                    
                                </Pressable>
                            ))
                            
                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                {loading}
                            </BrandText>

                        :
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                No completed chores
                            </BrandText>
                    }
                </View>
            </ScrollView>

            <ParentNavBar />
        </View>
    )
}