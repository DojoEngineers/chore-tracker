import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"

export const Terms = () => {

    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

            <View className="flex-1 items-center px-[16px]">

                <View className="flex-row mt-[75px]">

                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
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
                        We want our app to be safe and helpful for every family. By using the app,
                        you agree to use it responsibly and only for family chores and related activities.
                        Parents are responsible for managing their children’s accounts and information.
                        We do not sell your data and we take privacy seriously (see our Privacy section for details).
                        For any questions or concerns, contact us anytime at trackmychoresapp@gmail.com.
                    </BrandText>
                </View>
            </View>

            <View className="items-end">
                <SmallBottomRightSquiggle />
            </View>
        </View>
    )
}