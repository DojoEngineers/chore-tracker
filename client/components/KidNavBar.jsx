import { Pressable, View } from "react-native"
import {PlusIcon} from "./icons/PlusIcon.jsx"
import {HomeIcon} from "./icons/HomeIcon.jsx"
import {TodayIcon} from "./icons/TodayIcon.jsx"
import {ApproveIcon} from "./icons/ApproveIcon.jsx"
import {KidsIcon} from "./icons/KidsIcon.jsx"
import {HighlightedHomeIcon} from "./icons/HighlightedHomeIcon.jsx"
import {HighlightedTodayIcon} from "./icons/HighlightedTodayIcon.jsx"
import {HighlightedApproveIcon} from "./icons/HighlightedApproveIcon.jsx"
import {HighlightedKidsIcon} from "./icons/HighlightedKidsIcon.jsx"
import { useNavigation, useRoute } from "@react-navigation/native";
import { BrandText } from "./text/BrandText";


export const KidNavBar = () => {

    const navigation = useNavigation()
    const route = useRoute()

    return (
        <View className="bg-white dark:bg-[#333740] w-full h-[100px] border-t-2
            dark:border-[#737780] border-[#ECEDEE] flex-row justify-between pb-4 px-[50px]">
            
            <Pressable
                className="justify-center items-center"
                onPress={() => navigation.navigate("Dashboard", {animationType: "fade_from_bottom"})}
            >
                {route.name === "Dashboard" ? <HighlightedHomeIcon width={26} /> : <HomeIcon width={26} />}
                <BrandText
                    className={`mt-1 text-[14px] ${route.name === "Dashboard" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                >
                    Home
                </BrandText>
            </Pressable>

            <Pressable
                className="justify-center items-center"
                onPress={() => navigation.navigate("Today", {animationType: "fade_from_bottom"})}
            >
                {route.name === "Today" ? <HighlightedTodayIcon width={26} /> : <TodayIcon width={26} />}
                <BrandText
                    className={`mt-1 text-[14px] ${route.name === "Today" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                >
                    Today
                </BrandText>
            </Pressable>

            <Pressable
                className="justify-center items-center"
                onPress={() => navigation.navigate("Completed", {animationType: "fade_from_bottom"})}
            >
                {route.name === "Completed" ? <HighlightedApproveIcon width={26} /> : <ApproveIcon width={26} />}
                <BrandText
                    className={`mt-1 text-[14px] ${route.name === "Completed" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                >
                    Completed
                </BrandText>
            </Pressable>

        </View>
    )
}