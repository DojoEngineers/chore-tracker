import { Pressable, View } from "react-native"
import { useLogin } from "../context/UserContext"
import { TopSquiggle } from "./squiggles/TopSquiggle"
import { BrandBoldText } from "./text/BrandBoldText"
import { BrandText } from "./text/BrandText"
import {SettingsIcon} from "./icons/SettingsIcon"
import { useNavigation } from "@react-navigation/native"

export const Header = () => {

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    return (
        <View>
            <View className="absolute top-0 left-0 z-0">
                <TopSquiggle/>
            </View>

            <View className="flex-row mt-[60px] mb-6 justify-between ps-[16px] pe-[35px] items-center">
                <View className="flex-row items-center">
                    <View className="border border-lightPrimaryText dark:border-darkPrimaryText rounded-full me-3 aspect-square h-[50px] justify-center">
                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[18px] text-center">
                            {loggedInData.name[0]}
                        </BrandBoldText>
                    </View>

                    <View>
                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                            {loggedInData.name}
                        </BrandBoldText>
                        <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[18px]">
                            {loggedInData.isParent ? "Parent" : "Kid"}
                        </BrandText>
                    </View>
                </View>

                <Pressable
                    hitSlop={20}
                    onPress={() => navigation.navigate("Settings")}
                >
                    <SettingsIcon />
                </Pressable>
            </View>
        </View>
    )
}