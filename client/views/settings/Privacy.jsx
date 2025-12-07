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
                        We respect your privacy and keep your family’s data safe. We collect account info, profile details,
                        and app activity to help you assign and track chores. Your data is securely stored,
                        shared only with trusted services, and visible to family members in the app. Parents can manage all child accounts,
                        and you can update info or inactivate your account anytime. We never sell your data.
                        For questions, contact us at trackmychoresapp@gmail.com.
                    </BrandText>
                </View>
            </View>

            <View className="items-end">
                <SmallBottomRightSquiggle />
            </View>
        </View>
    )
}