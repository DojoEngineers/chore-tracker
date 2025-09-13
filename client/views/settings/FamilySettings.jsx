import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useLogin } from "../../context/UserContext"
import { BackArrow } from "../../components/icons/BackArrow"
import { useNavigation } from "@react-navigation/native"
import { BrandText } from "../../components/text/BrandText"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"

export const FamilySettings = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    const parents = loggedInData.family.parents.filter(parent => parent.isActive)
    const kids = loggedInData.family.children.filter(kid => kid.isActive)

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <View className="flex-1 items-center px-[16px]">

                <View className="flex-row mt-[75px]">

                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Manage Family
                        </BrandBoldText>
                    </View>
                </View>

                <View className="items-center my-[70px]">
                    <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                        After adding a family member, they will get an email with a verification code.
                        They can use the ‘Verify’ link on our home page to enter the code and create their account.
                    </BrandText>
                </View>

                <Pressable
                    className="p-[10px] mb-6 rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px]"
                    onPress={() => navigation.navigate('AddFamilyMember', {isParent:false})}
                >
                    <BrandBoldText className="text-white text-[20px]">Add a kid</BrandBoldText>
                </Pressable>

                {parents.length <= 2 &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px] mb-6"
                        onPress={() => navigation.navigate('AddFamilyMember', {isParent:true})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Add a second parent</BrandBoldText>
                    </Pressable>
                }

                {kids.length >= 1 &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px]"
                        onPress={() => navigation.navigate('DeleteKid', {kids})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Delete a kid</BrandBoldText>
                    </Pressable>
                }
            </View>

            <View className="absolute bottom-0 right-0 z-0">
                <SmallBottomRightSquiggle />
            </View>
        </View>
    )
}