import { Pressable, ScrollView, View, ImageBackground } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { BrandText } from "./text/BrandText"
import { useLogin } from "../context/UserContext"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { retrievePhotos } from "../services/r2.service"

export const HorizontalChoreScroll = ({chores, apiError, loading, noChoreMessage}) => {

    const [choresWithPhotos, setChoresWithPhotos] = useState()

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            Promise.all(
                chores.map((chore) => {
                    if (chore.afterPic) {
                        return retrievePhotos([chore.afterPic])
                            .then((res) => {
                                return { ...chore, afterPic: res[0].url }
                            })
                            .catch((error) => {
                                console.log("Error retrieving photo for chore:", chore._id, error)
                                return chore
                            })
                    } else {
                        return Promise.resolve(chore)
                    }
                })
            )
                .then((updatedChores) => {
                    setChoresWithPhotos(updatedChores)
                })
                .catch((err) => {
                    console.log("Error updating chores with photos:", err)
                })
        }, [chores])
    )

    return (
        <View className={`${!loggedInData.isParent && "flex-1"}`}>

            {choresWithPhotos?.length > 0
                ?
                    <ScrollView
                        className="px-[16px] my-4"
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {choresWithPhotos.map(chore => (
                            <Pressable
                                key={chore._id}
                                onPress={() => navigation.navigate("ViewChore", {id: chore._id})}
                            >
                                <ImageBackground
                                    source={chore.afterPic ? {uri: chore.afterPic} : null}
                                    className={`w-[123px] h-[123px] rounded-3xl overflow-hidden flex mr-3
                                        ${!chore.afterPic ? "bg-[#9FB6AE] dark:bg-[#2F3339]" : ""}
                                        ${loggedInData.isParent ? "justify-between" : "justify-center"}
                                    `}
                                    imageStyle={{ borderRadius: 24 }}
                                >
                                    {chore.afterPic && (
                                        <View className="absolute inset-0 bg-black opacity-30 rounded-3xl" />
                                    )}

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
                                        className="text-darkPrimaryText text-[12px] text-center px-1"
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
                                </ImageBackground>
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
                    <View className="flex-row my-3 bg-[#9FB6AE] dark:bg-[#2F3339] rounded-3xl py-4 px-6 mx-[16px]">
                        <BrandText
                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] my-4 px-[16px]"
                        >
                            {noChoreMessage}
                        </BrandText>
                    </View>
            }
        </View>
    )
}