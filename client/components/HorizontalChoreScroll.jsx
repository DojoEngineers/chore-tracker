import { Pressable, ScrollView, View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { BrandText } from "./text/BrandText"
import { useLogin } from "../context/UserContext"
import { useNavigation } from "@react-navigation/native"


export const HorizontalChoreScroll = ({chores, apiError, loading, noChoreMessage}) => {

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    return (
        <View className={`${!loggedInData.isParent && "flex-1"}`}>

            {chores.length > 0
                ?
                    <ScrollView
                        horizontal
                        className="px-[16px] my-4"
                        showsVerticalScrollIndicator={true}
                    >
                        {chores.map(chore => (
                            <Pressable
                                key={chore._id}
                                className={`w-[96px] h-[123px] rounded-3xl dark:bg-[#2F3339] bg-[#9FB6AE] mr-3
                                    ${loggedInData.isParent ? "justify-between" : "justify-center"}`}
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                            >
                                {loggedInData.isParent &&
                                    <View
                                        className="bg-[#FEDBB1] w-[49px] h-[14px] items-center justify-center rounded-r mt-[20px] px-1"
                                    >
                                        <BrandBoldText
                                            className="text-[#431507] text-[10px]"
                                            numberOfLines={1}
                                            adjustsFontSizeToFit={true}
                                            minimumFontScale={0.5}
                                        >
                                            {chore.worker.name}
                                        </BrandBoldText>
                                    </View>
                                }

                                <BrandBoldText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[12px] text-center px-1"
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {chore.title}
                                </BrandBoldText>

                                {loggedInData.isParent &&
                                    <View
                                        className="border-t-2 border-[#FEDBB1] h-[28px] justify-center items-center
                                            bg-[#C2430C] dark:bg-[#EA5A0C] rounded-b-3xl"
                                    >
                                        <BrandBoldText
                                            className="text-[#FFF7ED] text-[12px]"
                                        >
                                            Review
                                        </BrandBoldText>
                                    </View>
                                }
                            </Pressable>
                        ))}
                    </ScrollView>

                : loading ?
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-4 px-[16px]"
                    >
                        {loading}
                    </BrandText>
                
                : apiError ?
                    <BrandText
                        className="text-red-500 text-[16px] my-4 px-[16px]"
                    >
                        {apiError}
                    </BrandText>

                :
                    <BrandText
                        className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-4 px-[16px]"
                    >
                        {noChoreMessage}
                    </BrandText>
            }
        </View>
    )
}