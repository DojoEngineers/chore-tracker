import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Pressable, ScrollView, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useCallback, useState } from "react"
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
import { WeeklyRepeatIcons } from "../../components/WeeklyRepeatIcons";
import { DeleteModal } from "../../components/DeleteModal.jsx"
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SwipeDeleteButton } from "../../components/SwipeDeleteButton.jsx"

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(isSameOrBefore)

export const KidDetails = ({route}) => {

    const [apiErrors, setApiErrors] = useState({})
    const [chores, setChores] = useState({today: [], thisWeek: [], completed: []})
    const [modalVisible, setModalVisible] = useState({delete: false})
    const [id, setId] = useState("")
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()
    const { kid } = route.params

    useFocusEffect(
        useCallback(() => {
            setApiErrors({})
            setLoading(true)
            getChoresByWorker(kid._id)
                .then((res) => {
                    // Today's chores
                    const today = res.filter((chore) =>
                        ['incomplete', 'rejectedReassigned'].includes(chore.stage) &&
                        dayjs(chore.dueDate).local().isSameOrBefore(dayjs().local(), 'day')
                    )
                    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())

                    // Rest of the week chores (excluding today)
                    const seenTemplates = new Set()
                    const thisWeek = res.filter((chore) =>
                        dayjs(chore.dueDate).local().isBetween(dayjs().add(1, 'day').startOf('day'), dayjs().endOf('week'), null, '[]') &&
                        ['incomplete', 'rejectedReassigned'].includes(chore.stage)
                    )
                    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
                    .filter(chore => {
                        if (chore.templateId) {
                            if (seenTemplates.has(chore.templateId.toString())) return false
                            seenTemplates.add(chore.templateId.toString())
                            return true
                        }
                        return true
                    })

                    // Completed chores
                    const completed = res
                    .filter(chore => ['complete', 'approved', 'rejectedUnassigned'].includes(chore.stage))
                    .sort((a, b) => dayjs(b.stageDate).valueOf() - dayjs(a.stageDate).valueOf())

                    // Set chores in state
                    setChores({today, thisWeek, completed})
                })
                .catch ((error) => {
                    console.log("getChoresByWorker error:", error)
                    setApiErrors(prev => ({...prev, getChoresByWorker: "Unable to get chore information."}))
                    Toast.show({type: 'error', text1: "Unable to get chore information."})
                })
                .finally(() => setLoading(false))
        }, [kid, refreshTrigger])
    )

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

            {apiErrors.deleteChore && (
                <BrandText className="text-red-500 text-center">
                    {apiErrors.deleteChore}
                </BrandText>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-[16px] flex-1"
            >
                <View className="py-[15px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                    <View className="flex-row items-center w-full">
                        <DueTodayIcon/>

                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            Due Today
                        </BrandBoldText>
                    </View>

                    {chores.today.length > 0 && !loading
                        ?
                            chores.today.map((chore) => (
                                <ReanimatedSwipeable
                                    key={chore._id}
                                    renderRightActions={() => (
                                        <SwipeDeleteButton
                                            choreId={chore._id}
                                            setModalVisible={setModalVisible}
                                            setId={setId}
                                        />
                                    )}
                                >
                                    <Pressable
                                        onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                        className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-3 mt-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <BrandText
                                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                            >
                                                {chore.title}
                                            </BrandText>

                                            {dayjs(chore.dueDate).isBefore(dayjs())
                                                ?
                                                    <BrandBoldText
                                                        className="text-[#F40000] text-[12px]"
                                                    >
                                                        Overdue!
                                                    </BrandBoldText>

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
                                                {`${kid.name} • `}
                                            </BrandText>

                                            <View className={`rounded-full py-1 px-3
                                                ${chore.stage === "incomplete"
                                                    ? "bg-[#FDBB74]" : ""}
                                                ${chore.stage === "rejectedReassigned"
                                                    ? "bg-[#FF5757]" : ""}`}
                                            >
                                                <BrandBoldText
                                                    className="text-[12px] text-[#111215]"
                                                >
                                                    {chore.stage === "incomplete" ? "Incomplete" : "Rejected and reassigned"}
                                                </BrandBoldText>
                                            </View>

                                        </View>
                                        
                                    </Pressable>
                                </ReanimatedSwipeable>
                            ))

                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                Loading chores...
                            </BrandText>
                        
                        : apiErrors.getChoresByWorker ?
                            <BrandText
                                className="text-red-500 text-[14px] mt-4"
                            >
                                {apiErrors.getChoresByWorker}
                            </BrandText>

                        :
                            <View className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-6 mt-4">
                                <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
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

                    {chores.thisWeek.length > 0 && !loading
                        ?
                            chores.thisWeek.map((chore) => (
                                <ReanimatedSwipeable
                                    key={chore._id}
                                    renderRightActions={() => (
                                        <SwipeDeleteButton
                                            choreId={chore._id}
                                            setModalVisible={setModalVisible}
                                            setId={setId}
                                        />
                                    )}
                                >
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

                                            {chore.repeat === "weekly"
                                                ?
                                                    <WeeklyRepeatIcons chore={chore} fontSize={12} circleSize={20}/>

                                                : chore.repeat === "daily" ?
                                                    <BrandText
                                                        className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                                    >
                                                        Due daily by {dayjs(chore.dueDate).local().format("h:mma")}
                                                    </BrandText>

                                                :
                                                    <BrandText
                                                        className="dark:text-[#ECEDEE] text-lightPrimaryText text-[12px]"
                                                    >
                                                        Due on {dayjs(chore.dueDate).local().format("dddd")}
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
                                                {`${kid.name} • `}
                                            </BrandText>

                                            <View className={`rounded-full py-1 px-3
                                                ${chore.stage === "incomplete"
                                                    ? "bg-[#FDBB74]" : ""}
                                                ${chore.stage === "rejectedReassigned"
                                                    ? "bg-[#FF5757]" : ""}`}
                                            >
                                                <BrandBoldText
                                                    className="text-[12px] text-[#111215]"
                                                >
                                                    {chore.stage === "incomplete" ? "Incomplete" : "Rejected and reassigned"}
                                                </BrandBoldText>
                                            </View>
                                        </View>
                                    </Pressable>
                                </ReanimatedSwipeable>
                            ))

                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                Loading chores...
                            </BrandText>

                        : apiErrors.getChoresByWorker ?
                            <BrandText
                                className="text-red-500 text-[14px] mt-4"
                            >
                                {apiErrors.getChoresByWorker}
                            </BrandText>

                        :
                            <View className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-6 mt-4">
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                >
                                    No chores due by end of week
                                </BrandText>
                            </View>
                    }
                </View>

                <View className="py-[15px] px-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3 flex-1">
                    <View className="flex-row items-center w-full">
                        <CheckIcon/>

                        <BrandBoldText className="dark:text-[#ECEDEE] text-lightPrimaryText text-[16px] ms-5">
                            Chore history
                        </BrandBoldText>
                    </View>

                    {chores.completed.length > 0 && !loading
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
                                            {dayjs(chore.stageDate).local().format("MMMM D")}
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
                                            {`${kid.name} • `}
                                        </BrandText>

                                        <View className={`rounded-full py-1 px-3
                                            ${chore.stage === "approved"
                                                ? "bg-[#9FB6AE] dark:bg-[#B3EAD3]" : ""}
                                            ${chore.stage === "rejectedUnassigned"
                                                ? "bg-[#FF5757]" : ""}
                                            ${chore.stage === "complete"
                                                ? "bg-[#FDBB74]" : ""}`}
                                        >
                                            <BrandBoldText
                                                className="text-[12px] text-[#111215]"
                                            >
                                                {chore.stage === "approved" ? "Approved"
                                                    : chore.stage === "rejectedUnassigned" ? "Rejected"
                                                    : "Awaiting review"}
                                            </BrandBoldText>
                                        </View>
                                    </View>
                                </Pressable>
                            ))
                            
                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] mt-4"
                            >
                                Loading chores...
                            </BrandText>

                        : apiErrors.getChoresByWorker ?
                            <BrandText
                                className="text-red-500 text-[14px] mt-4"
                            >
                                {apiErrors.getChoresByWorker}
                            </BrandText>

                        :
                            <View className="flex-1 w-full rounded-2xl bg-[#DFE8E4] dark:bg-darkBg p-6 mt-4">
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                >
                                    No chore history
                                </BrandText>
                            </View>
                    }
                </View>
            </ScrollView>

            <DeleteModal
                visible={modalVisible.delete}
                setVisible={setModalVisible}
                setApiErrors={setApiErrors}
                id={id}
                setRefreshTrigger={setRefreshTrigger}
            />

            <ParentNavBar />
        </View>
    )
}