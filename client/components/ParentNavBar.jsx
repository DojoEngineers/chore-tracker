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

export const ParentNavBar = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const isOnKids = route.name === "Kids" || route.name === "KidDetails"

    return (
        <View className="relative bg-white dark:bg-[#333740] border-t-2 dark:border-[#737780] border-[#ECEDEE] py-[3%]">
            <View className="flex-row justify-evenly items-center w-full">
                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("Dashboard", {animationType: "fade_from_bottom"})}
                >
                    {route.name === "Dashboard" ? <HighlightedHomeIcon width={26} /> : <HomeIcon width={26} />}
                    <BrandText
                        className={`mt-1 text-[10px] ${route.name === "Dashboard" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        Home
                    </BrandText>
                </Pressable>
            
                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("Today", {animationType: "fade_from_bottom"})}
                >
                    {route.name === "Today" ? <HighlightedTodayIcon width={26} /> : <TodayIcon width={26} />}
                    <BrandText
                        className={`mt-1 text-[10px] ${route.name === "Today" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        Today
                    </BrandText>
                </Pressable>
            
                <View className="w-[5%]"></View>

                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("Approve", {animationType: "fade_from_bottom"})}
                >
                    {route.name === "Approve" ? <HighlightedApproveIcon width={26} /> : <ApproveIcon width={26} />}
                    <BrandText
                        className={`mt-1 text-[10px] ${route.name === "Approve" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        Approve
                    </BrandText>
                </Pressable>
            
                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("Kids", {animationType: "fade_from_bottom"})}
                >
                    {isOnKids ? <HighlightedKidsIcon width={26} /> : <KidsIcon width={26} />}
                    <BrandText
                        className={`mt-1 text-[10px] ${isOnKids ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        Kids
                    </BrandText>
                </Pressable>
            </View>

            <Pressable
                className="absolute left-1/2 -translate-x-1/2 [top:-33px] w-[66px] h-[66px] rounded-full
                    justify-center items-center border-[5px] border-white bg-lightButton dark:bg-darkButton shadow"
                onPress={() => {navigation.navigate("NewChore", {animationType: "slide_from_bottom"})}}
            >
                    <PlusIcon />
            </Pressable>
        </View>
    )
}