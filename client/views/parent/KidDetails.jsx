import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"


export const KidDetails = ({route}) => {

    const navigation = useNavigation()
    const { kid } = route.params

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">

            <View className="flex-row mt-[75px] items-center ps-2 mb-4">
                <Pressable
                    hitSlop={20}
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow/>
                </Pressable>
            
                <BrandBoldText className="text-[20px] text-lightPrimaryText dark:text-darkPrimaryText ml-8">
                    {kid.name}
                </BrandBoldText>
            </View>

            <View>
                <BrandBoldText
                    className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText"
                >
                    Due today
                </BrandBoldText>
            </View>

            <View>
                <BrandBoldText
                    className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText"
                >
                    Due this week
                </BrandBoldText>
            </View>

            <View>
                <BrandBoldText
                    className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText"
                >
                    Completed chore history
                </BrandBoldText>
            </View>

        </View>
    )
}