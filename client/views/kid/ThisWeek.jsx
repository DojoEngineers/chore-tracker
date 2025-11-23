import { Pressable, ScrollView, View } from "react-native"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {SquareIcon} from "../../components/icons/SquareIcon"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useLogin } from "../../context/UserContext";
import isBetween from 'dayjs/plugin/isBetween';
import { Header } from "../../components/Header";
import { BrandBoldText } from "../../components/text/BrandBoldText";
import { BrandText } from "../../components/text/BrandText";
import { KidNavBar } from "../../components/KidNavBar";
import { ForwardArrow } from "../../components/icons/ForwardArrow";
import { getChoresByWorker } from "../../services/chore.service";
import { WeeklyRepeatIcons } from "../../components/WeeklyRepeatIcons";
import Toast from "react-native-toast-message";

dayjs.extend(utc)
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)

export const ThisWeek = () => {

        const [apiErrors, setApiErrors] = useState({})
        const [chores, setChores] = useState({today: [], thisWeek: []})
        const [loading, setLoading] = useState("Loading chores...")
    
        const navigation = useNavigation()
        const {loggedInData} = useLogin()

        useFocusEffect(
            useCallback(() => {
                setLoading("Loading chore...")
                setApiErrors({})
                getChoresByWorker(loggedInData._id)
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
        
                        // Set chores in state
                        setChores(prev => ({...prev, today, thisWeek}))
                    })
                    .catch ((error) => {
                        console.log("getChoresByWorker error:", error)
                        setApiErrors(prev => ({...prev, getChoresByWorker: "Unable to get chore information."}))
                        Toast.show({type: 'error', text1: "Unable to get chore information."})
                    })
                    .finally(() => setLoading(false))
            }, [])
        )

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
        
            <Header />

            <BrandBoldText
                className="text-lightPrimaryText dark:text-darkPrimaryText text-[36px] px-[16px]"
            >
                This week
            </BrandBoldText>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-[16px] mt-2 flex-1"
            >

                <BrandText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-2 mb-3"
                >
                    Due today
                </BrandText>

                {chores.today.length > 0
                    ?
                        chores.today.map((chore) => (
                            <Pressable
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                className="flex-row w-full my-3 bg-[#9FB6AE]
                                    dark:bg-[#2F3339] rounded-3xl py-4 px-6"
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

                                    <View className="flex-row items-center mb-2">
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px]"
                                        >
                                            {`${loggedInData.name} • `}
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

                                    {dayjs(chore.dueDate).isBefore(dayjs())
                                        ?
                                            <BrandBoldText
                                                className="text-[#F40000] text-[10px]"
                                            >
                                                Overdue!
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

                    : loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText my-2 px-[16px] flex-1"
                        >
                            {loading}
                        </BrandText>

                    : apiErrors.getChoresByWorker ?
                        <BrandText
                            className="text-red-500 px-[16px] flex-1 my-2"
                        >
                            {apiErrors.getChoresByWorker}
                        </BrandText>

                    :
                        <View className="flex-row w-full my-3 bg-[#9FB6AE] dark:bg-[#2F3339] rounded-3xl py-4 px-6">
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] my-2 px-[16px] flex-1"
                            >
                                No chores due today
                            </BrandText>
                        </View>
                }

                <BrandText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-2 my-3"
                >
                    Due by end of week
                </BrandText>

                {chores.thisWeek.length > 0
                    ?
                        chores.thisWeek.map((chore) => (
                            <Pressable
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                className="flex-row w-full my-3 bg-[#9FB6AE]
                                    dark:bg-[#2F3339] rounded-3xl py-4 px-6"
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

                                    <View className="flex-row items-center mb-2">
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px]"
                                        >
                                            {`${loggedInData.name} • `}
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

                                <View className="justify-center">
                                    <ForwardArrow />
                                </View>
                            </Pressable>
                        ))

                    : loading ?
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText my-2 px-[16px] flex-1"
                        >
                            {loading}
                        </BrandText>

                    : apiErrors.getChoresByWorker ?
                        <BrandText
                            className="text-red-500 px-[16px] flex-1 my-2"
                        >
                            {apiErrors.getChoresByWorker}
                        </BrandText>

                    :
                        <View className="flex-row w-full my-3 bg-[#9FB6AE] dark:bg-[#2F3339] rounded-3xl py-4 px-6">
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] my-2 px-[16px] flex-1"
                            >
                                No chores due by end of week
                            </BrandText>
                        </View>
                }

            </ScrollView>

            <KidNavBar/>
        </View>
    )
}