import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"

export const Privacy = () => {

    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">

            <View className="flex-1 items-center px-[16px]">

                <View className="flex-row mt-[13%]">

                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 mb-8 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Privacy
                        </BrandBoldText>
                    </View>
                </View>

                <View className="items-center mb-8">
                    <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                        We respect your privacy and keep your family’s data secure. We collect parent account
                        info (name, email), child account info (name, email), chores (name, due date, photos,
                        description, completion stage, other details), and device identifiers for notifications. 
                        Each account has a unique user ID stored to manage accounts, and device push tokens are
                        used to send notifications to the correct device. This data is used to manage accounts
                        and track chores, shared only with trusted service providers, and never sold. Parents
                        manage child accounts, and we comply with COPPA. You can update your information or
                        inactivate your account at any time. For questions, contact trackmychoresapp@gmail.com.
                    </BrandText>
                </View>
            </View>

            <View className="items-end">
                <SmallBottomRightSquiggle />
            </View>
        </View>
    )
}