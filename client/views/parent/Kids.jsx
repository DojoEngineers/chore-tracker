import { Pressable, ScrollView, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useEffect } from "react"

export const Kids = () => {

    const {loggedInData} = useLogin()
    const navigation = useNavigation()
    const kids = loggedInData.family.children.filter(kid => kid.isActive)

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <View>
                <Header />
                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Kids
                </BrandBoldText>
                {kids.length == 0 &&
                    <View>
                        <View className="flex-row">
                            <View className="flex-1">
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px] mb-6"
                                    >
                                    Tap the button to add a kid. After adding a kid, they will get an email with a verification code.{"\n"}{"\n"}
                                    They can use the ‘Verify’ link on our home page to enter the code and create their account.
                                </BrandText>
                            </View>
                        </View>
                    </View>
                }
            </View>

            {kids.length > 0 &&
                <ScrollView
                    contentContainerClassName="items-center flex-grow"
                    showsVerticalScrollIndicator={true}
                    className="flex-1 px-[16px]"
                >
                    {loggedInData.family.children.map((kid) => (
                        <View key={kid._id} className="mb-8 items-center">
                            <Pressable
                                onPress={() => {navigation.navigate("KidDetails", {kid})}}
                                className="w-[207px] h-[207px] rounded-full items-center justify-center mb-2 dark:bg-[#333740] shadow"
                            >
                                <BrandText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[128px]"
                                >
                                    {kid.name[0]}
                                </BrandText>
                            </Pressable>
                            <BrandBoldText
                                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[20px] text-center"
                                >
                                    {kid.name}
                            </BrandBoldText>
                        </View>
                    ))}
                </ScrollView>
            }
            
            <View>
                <View className="px-[16px] w-full mb-[50px]">
                    <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                </View>
                <ParentNavBar />
            </View>
        </View>
    )
}