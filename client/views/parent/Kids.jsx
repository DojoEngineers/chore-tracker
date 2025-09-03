import { Pressable, ScrollView, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import { useEffect } from "react"
import { KidArrow } from "../../components/icons/KidArrow"

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
            </View>

            <View className="flex-1 px-[16px]">
                {kids.length === 0
                    ?
                        <View className="flex-1 mt-6 items-center">
                            <BrandText
                                className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] px-[16px]"
                            >
                                Tap the button to add a kid. After adding a kid, they will get an email with a verification code.{"\n"}{"\n"}
                                They can use the ‘Verify’ link on our home page to enter the code and create their account.
                            </BrandText>
                            <KidArrow/>
                            <View className="w-full">
                                <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                            </View>
                        </View>

                    : 
                        <View className="flex-1">
                            <ScrollView
                                contentContainerClassName="items-center flex-grow"
                                showsVerticalScrollIndicator={true}
                                className="flex-1"
                            >
                                {loggedInData.family.children.map((kid) => (
                                    <View key={kid._id} className="mb-8 items-center">
                                        <Pressable
                                            onPress={() => {navigation.navigate("KidDetails", {kid})}}
                                            className="w-[207px] h-[207px] rounded-full items-center justify-center mb-2 dark:bg-[#333740] bg-[#D0D1D4]"
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
                            <View className="w-full mb-[50px]">
                                <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                            </View>
                        </View>
                }
            </View>
            
            <ParentNavBar />
        </View>
    )
}