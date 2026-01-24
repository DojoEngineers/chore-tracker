import { Pressable, ScrollView, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { BrandText } from "../../components/text/BrandText"
import { PrimaryButton } from "../../components/PrimaryButton"
import {LargeKidsIcon} from "../../components/icons/LargeKidsIcon"
import {AddKidIcon} from "../../components/icons/AddKidIcon"

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
                        <ScrollView
                            contentContainerClassName="items-center flex-grow"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="flex-1 mt-4 items-center w-full">
                                <View className="p-[25px] rounded-3xl bg-[#9FB6AE] dark:bg-[#2F3339] w-full my-3">
                                    <View className="flex-row">
                                        <AddKidIcon />

                                        <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText ms-6">
                                            How to add a kid
                                        </BrandBoldText>
                                    </View>

                                    <BrandText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText my-4 ms-12">
                                        Tap the button to add a kid. After adding a kid, they will receive an email with a verification code.
                                    </BrandText>

                                    <View className="bg-[#DFE8E4] dark:bg-darkBg rounded-3xl py-4 px-5 ms-11">
                                        <BrandBoldText className="text-[16px] text-lightPrimaryText dark:text-darkPrimaryText">
                                            Next step: 
                                            <BrandText> Your kid will use the ‘Verify’ link on our home page to enter the code and create their account.</BrandText>
                                        </BrandBoldText>
                                    </View>
                                </View>

                                <View className="w-full mt-[20px]">
                                    <PrimaryButton onPress={() => navigation.navigate("AddFamilyMember", {isParent:false})} label="Add a kid" />
                                </View>

                                <View className="flex-1 items-center w-full justify-center mt-[20px] mb-[40px]">
                                    <LargeKidsIcon />

                                    <BrandText className="text-[16px] text-[#737780] dark:text-[#A1A4AA] mt-[20px]">
                                        No kids added yet
                                    </BrandText>
                                </View>
                            </View>
                        </ScrollView>

                    : 
                        <View className="flex-1">
                            <ScrollView
                                contentContainerClassName="items-center flex-grow"
                                showsVerticalScrollIndicator={false}
                                className="flex-1"
                            >
                                {kids.map((kid) => (
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
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                                {kid.name}
                                        </BrandBoldText>

                                        <BrandText
                                            className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] text-center"
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {kid.username}
                                        </BrandText>
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