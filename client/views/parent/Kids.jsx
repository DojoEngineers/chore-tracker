import { Pressable, ScrollView, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"

export const Kids = () => {

    const {loggedInData} = useLogin()
    const navigation = useNavigation()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
            <View>
                <Header />
                <BrandBoldText
                    className="text-lightPrimaryText dark:text-darkPrimaryText text-[32px] px-[16px]"
                >
                    Kids
                </BrandBoldText>
                {loggedInData.family.children.length < 1
                    ?
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

                    :
                        <ScrollView
                            contentContainerClassName="items-center"
                            showsVerticalScrollIndicator={true}
                            className="h-[490px]"
                        >
                            {loggedInData.family.children.map((kid) => (
                                <View key={kid._id}>
                                    <Pressable
                                        onPress={() => {navigation.navigate("KidDetails", {kid})}}
                                        className="w-[207px] h-[207px] rounded-full border-lightPrimaryText
                                        dark:border-darkPrimaryText items-center justify-center mb-2 border-2"
                                    >
                                        <BrandBoldText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[40px]"
                                        >
                                            {kid.name[0]}
                                        </BrandBoldText>
                                    </Pressable>
                                    <BrandBoldText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[20px] text-center mb-8"
                                        >
                                            {kid.name}
                                    </BrandBoldText>
                                </View>
                            ))}
                        </ScrollView>
                }
                <View className="px-[16px] w-full">
                    <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                </View>
            </View>
            <ParentNavBar />
        </View>
    )
}