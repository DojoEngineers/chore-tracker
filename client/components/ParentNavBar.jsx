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
    const homeRoutes = ['ParentDashboard']
    const kidsRoutes = ['Kids', 'KidDetails']
    const todayRoutes = ['Today']
    const isOnHome = homeRoutes.includes(route.name)
    const isOnKids = kidsRoutes.includes(route.name)
    const isOnToday = todayRoutes.includes(route.name)

    return (
        <View className="relative">
            <View className="bg-white dark:bg-[#333740] w-full h-[100px] border-t-2 dark:border-[#737780] border-[#ECEDEE] flex-row justify-between pb-4 px-[22px]">
                {isOnHome
                    ?
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => {}}
                        >
                            <HighlightedHomeIcon width={26} />
                            <BrandText className="text-lightButton dark:text-darkButton mt-1 text-[14px]">
                                Home
                            </BrandText>
                        </Pressable>
                    :
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => navigation.navigate("ParentDashboard", {animationType: "fade_from_bottom"})}
                        >
                            <HomeIcon width={26} />
                            <BrandText className="text-[#D0D1D4] mt-1 text-[14px]">
                                Home
                            </BrandText>
                        </Pressable>
                }
                {isOnToday
                    ?
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => navigation.navigate("Today", {animationType: "fade_from_bottom"})}
                        >
                            <HighlightedTodayIcon width={26} />
                            <BrandText className="text-lightButton dark:text-darkButton mt-1 text-[14px]">
                                Today
                            </BrandText>
                        </Pressable>
                    :
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => navigation.navigate("Today", {animationType: "fade_from_bottom"})}
                        >
                            <TodayIcon width={26} />
                            <BrandText className="text-[#D0D1D4] mt-1 text-[14px]">
                                Today
                            </BrandText>
                        </Pressable>
                }
                <View className="justify-center items-center"></View>
                {!isOnHome && !isOnKids && !isOnToday
                    ?
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => {}}
                        >
                            <HighlightedApproveIcon width={28} />
                            <BrandText className="text-lightButton dark:text-darkButton mt-1 text-[14px]">
                                Approve
                            </BrandText>
                        </Pressable>
                    :
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => {}}
                        >
                            <ApproveIcon width={28} />
                            <BrandText className="text-[#D0D1D4] mt-1 text-[14px]">
                                Approve
                            </BrandText>
                        </Pressable>
                }
                {isOnKids
                    ?
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => navigation.navigate("Kids", {animationType: "fade_from_bottom"})}
                        >
                            <HighlightedKidsIcon width={26} />
                            <BrandText className="text-lightButton dark:text-darkButton mt-1 text-[14px]">
                                Kids
                            </BrandText>
                        </Pressable>
                    :
                        <Pressable
                            className="justify-center items-center"
                            onPress={() => navigation.navigate("Kids", {animationType: "fade_from_bottom"})}
                        >
                            <KidsIcon width={26} />
                            <BrandText className="text-[#D0D1D4] mt-1 text-[14px]">
                                Kids
                            </BrandText>
                        </Pressable>
                }
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