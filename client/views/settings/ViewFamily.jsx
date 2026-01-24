import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useLogin } from "../../context/UserContext"
import { ScrollView } from "react-native-gesture-handler"
import { BrandText } from "../../components/text/BrandText"

export const ViewFamily = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    const parents = loggedInData.family.parents.filter(parent => parent.isActive)
    const kids = loggedInData.family.children.filter(kid => kid.isActive)
    const family = [...parents, ...kids]

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <View className="flex-row mt-[13%] mb-4 px-[16px]">
                <Pressable
                    className="pt-4 ps-2"
                    hitSlop={20}
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow/>
                </Pressable>

                <View className="flex-1 ms-[34px]">
                    <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                        View Family
                    </BrandBoldText>
                </View>
            </View>

            <View className="flex-1 px-[16px]">
                <View className="flex-1">
                    <ScrollView
                        contentContainerClassName="items-center flex-grow"
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    >
                        {family.map((member, index) => (
                            <View key={member._id} className="mb-8 items-center">
                                <View
                                    className="w-[207px] h-[207px] rounded-full items-center justify-center mb-2 dark:bg-[#333740] bg-[#D0D1D4]"
                                >
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[128px]"
                                    >
                                        {member.name[0]}
                                    </BrandText>
                                </View>

                                <BrandBoldText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[20px] text-center"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {member.name}
                                </BrandBoldText>

                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {member.username}
                                </BrandText>

                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                >
                                    {member.isParent ? "Parent" : "Kid"}
                                </BrandText>

                                {index === 0 &&
                                    <BrandText
                                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                    >
                                        Family Account Creator
                                    </BrandText>
                                }

                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}