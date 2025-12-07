import { useLogin } from "../../context/UserContext"
import { getChoresByWorker } from "../../services/chore.service"
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import { Header } from "../../components/Header";
import { HorizontalChoreScroll } from "../../components/HorizontalChoreScroll";
import { KidNavBar } from "../../components/KidNavBar";
import { ScrollView, View } from "react-native";
import { BrandBoldText } from "../../components/text/BrandBoldText";
import Toast from "react-native-toast-message";


export const Completed = () => {

    const [apiErrors, setApiErrors] = useState({})
    const [loading, setLoading] = useState("Loading chores...")
    const [chores, setChores] = useState({complete: [], approved: [], rejectedUnassigned: []})

    const {loggedInData} = useLogin()

    useEffect(() => {
        getChoresByWorker(loggedInData._id)
            .then((res) => {
                const complete = res.filter(chore => 
                    chore.stage === "complete"
                )
                .sort((a, b) => dayjs(a.stageDate).valueOf() - dayjs(b.dueDate).valueOf())

                const approved = res.filter(chore => 
                    chore.stage === "approved"
                )
                .sort((a, b) => dayjs(a.stageDate).valueOf() - dayjs(b.dueDate).valueOf())

                const rejectedUnassigned = res.filter(chore => 
                    chore.stage === "rejectedUnassigned"
                )
                .sort((a, b) => dayjs(a.stageDate).valueOf() - dayjs(b.dueDate).valueOf())
                
                setChores(prev => ({...prev, complete, approved, rejectedUnassigned}))
            })
            .catch((error) => {
                console.log("getChoresByWorker error:", error)
                setApiErrors(prev => ({...prev, getChoresByWorker: "Unable to get chore information."}))
                Toast.show({type: 'error', text1: "Unable to get chore information."})
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <Header />

            <ScrollView
                contentContainerClassName="flex-grow justify-between"
                showsVerticalScrollIndicator={false}
            >
                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Waiting for approval
                </BrandBoldText>

                <HorizontalChoreScroll chores={chores.complete} apiError={apiErrors.getChoresByWorker}
                    loading={loading} noChoreMessage="No chores waiting for approval"/>

                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Approved
                </BrandBoldText>

                <HorizontalChoreScroll chores={chores.approved} apiError={apiErrors.getChoresByWorker}
                    loading={loading} noChoreMessage="No approved chores"/>

                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Rejected
                </BrandBoldText>

                <HorizontalChoreScroll chores={chores.rejectedUnassigned} apiError={apiErrors.getChoresByWorker}
                    loading={loading} noChoreMessage="No rejected chores"/>
            </ScrollView>

            <KidNavBar />

        </View>
    )
}