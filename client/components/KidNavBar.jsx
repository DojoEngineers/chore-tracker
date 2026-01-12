import { Pressable, View } from "react-native"
import {HomeIcon} from "./icons/HomeIcon.jsx"
import {TodayIcon} from "./icons/TodayIcon.jsx"
import {ApproveIcon} from "./icons/ApproveIcon.jsx"
import {HighlightedHomeIcon} from "./icons/HighlightedHomeIcon.jsx"
import {HighlightedTodayIcon} from "./icons/HighlightedTodayIcon.jsx"
import {HighlightedApproveIcon} from "./icons/HighlightedApproveIcon.jsx"
import { useNavigation, useRoute } from "@react-navigation/native";
import { BrandText } from "./text/BrandText";


export const KidNavBar = () => {

    const navigation = useNavigation()
    const route = useRoute()

    return (
        <View className="bg-white dark:bg-[#333740] w-full py-[3%] border-t-2
            dark:border-[#737780] border-[#ECEDEE] flex-row">
            
            <View className="flex-1 items-center justify-center">
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
            </View>

            <View className="flex-1 items-center justify-center">
                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("ThisWeek", {animationType: "fade_from_bottom"})}
                >
                    {route.name === "ThisWeek" ? <HighlightedTodayIcon width={26} /> : <TodayIcon width={26} />}
                    <BrandText
                        className={`mt-1 text-[10px] ${route.name === "ThisWeek" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        This Week
                    </BrandText>
                </Pressable>
            </View>

            <View className="flex-1 items-center justify-center">
                <Pressable
                    className="justify-center items-center"
                    onPress={() => navigation.replace("Completed", {animationType: "fade_from_bottom"})}
                >
                    {route.name === "Completed" ? <HighlightedApproveIcon width={26} /> : <ApproveIcon width={26} />}
                    <BrandText
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className={`mt-1 text-[10px] ${route.name === "Completed" ? "text-lightButton dark:text-darkButton" : "text-[#D0D1D4]"}`}
                    >
                        Completed
                    </BrandText>
                </Pressable>
            </View>

        </View>
    )
}