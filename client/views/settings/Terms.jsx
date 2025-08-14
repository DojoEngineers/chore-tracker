import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { LogoBottomSquiggle } from "../../components/squiggles/LogoBottomSquiggle"

export const Terms = () => {

    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

            <View className="flex-1 items-center px-[16px]">

                <View className="flex-row mt-[150px]">

                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 mb-8 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Terms and policies
                        </BrandBoldText>
                    </View>
                </View>

                <View className="items-center mb-8">
                    <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                        Text here.
                    </BrandText>
                </View>
            </View>

            <View className="items-end">
                <LogoBottomSquiggle />
            </View>
        </View>
    )
}