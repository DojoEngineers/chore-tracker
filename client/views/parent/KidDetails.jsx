import { useNavigation } from "@react-navigation/native"
import { Pressable, ScrollView, Text, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useEffect, useState } from "react"
import {getChoresByWorker} from "../../services/chore.service.js"
import Toast from "react-native-toast-message"
import { BrandText } from "../../components/text/BrandText"
import {CheckboxIcon} from "../../components/icons/CheckboxIcon"
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ParentNavBar } from "../../components/ParentNavBar.jsx"
import utc from 'dayjs/plugin/utc';
import { ForwardArrow } from "../../components/icons/ForwardArrow.jsx"

dayjs.extend(isBetween);
dayjs.extend(utc);

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
                    dayjs(chore.dueDate).local().isSame(dayjs(), 'day') &&
                    ['incomplete', 'rejected'].includes(chore.stage)
                )
                .sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)))

                // Rest of the week chores (excluding today)
                const thisWeek = res.filter((chore) =>
                    dayjs(chore.dueDate).local().isBetween(dayjs().add(1, 'day').startOf('day'), dayjs().endOf('week'), null, '[]') &&
                    ['incomplete', 'rejected'].includes(chore.stage)
                )
                .sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)))

                // Completed chores
                const completed = res.filter(chore => chore.stage === 'complete')
                .sort((a, b) => dayjs(b.dateCompleted).diff(dayjs(a.dateCompleted)))

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

            <View className="flex-row mt-[75px] items-center ps-[20px]">
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
                className="px-[16px]"
            >
                <View>
                    <BrandBoldText
                        className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText mt-8 mb-2"
                    >
                        Due today
                    </BrandBoldText>

                    {chores.today.length > 0
                        ?
                            chores.today.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-row w-full items-center py-3 justify-between"
                                    key={chore._id}
                                >
                                    <View className="flex-row items-center">
                                        <CheckboxIcon />
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] ps-3"
                                        >
                                            {chore.title}
                                        </BrandText>
                                    </View>
                                    <ForwardArrow />
                                </Pressable>
                            ))

                        : loading ?
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText"
                            >
                                {loading}
                            </BrandText>

                        :
                            <View>
                                <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] ps-3"
                                    >
                                        No chores due today
                                    </BrandText>
                            </View>
                    }
                </View>

                <View>
                    <BrandBoldText
                        className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText mt-6 mb-2"
                    >
                        Due this week
                    </BrandBoldText>

                    {chores.thisWeek.length > 0
                        ?
                            chores.thisWeek.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-row w-full items-center py-3 justify-between"
                                    key={chore._id}
                                >
                                    <View className="flex-row items-center">
                                        <CheckboxIcon />
                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] ps-3"
                                        >
                                            {chore.title}
                                        </BrandText>
                                    </View>
                                    <ForwardArrow />
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
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] ps-3"
                            >
                                No chores due this week
                            </BrandText>
                    }
                </View>

                <View>
                    <BrandBoldText
                        className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText mt-6 mb-4"
                    >
                        Completed chore history
                    </BrandBoldText>

                    {chores.completed.length > 0
                        ?
                            chores.completed.map((chore) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                                    className="flex-row w-full items-center py-3 px-5 dark:border rounded-3xl
                                        dark:border-darkPrimaryText bg-[#ACE6CD] dark:bg-transparent my-2"
                                    key={chore._id}
                                >
                                    <View className="rounded-full bg-lightBg
                                        me-3 aspect-square h-[30px] justify-center dark:bg-darkButton">
                                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] text-center">
                                            {kid.name[0]}
                                        </BrandBoldText>
                                    </View>

                                    <View className="flex-1">

                                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]">
                                            <BrandBoldText>{kid.name} </BrandBoldText>
                                            completed{" "}
                                            <BrandBoldText>{chore.title}</BrandBoldText>
                                        </BrandText>

                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px]"
                                        >
                                            {dayjs(chore.dateCompleted).format('MMMM D, h:mmA')}
                                        </BrandText>
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
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[14px] ps-3 pb-3"
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