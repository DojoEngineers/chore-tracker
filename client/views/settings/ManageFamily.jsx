import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useLogin } from "../../context/UserContext"
import { BackArrow } from "../../components/icons/BackArrow"
import { useNavigation } from "@react-navigation/native"
import { SmallBottomRightSquiggle } from "../../components/squiggles/SmallBottomRightSquiggle"
import { BrandText } from "../../components/text/BrandText"

export const ManageFamily = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    const parents = loggedInData.family.parents.filter(parent => parent.isActive)
    const kids = loggedInData.family.children.filter(kid => kid.isActive)

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">

            <View className="flex-1 items-center px-[16px]">

                <View className="flex-row mt-[13%] mb-8">
                    <Pressable
                        className="pt-4 ps-2"
                        hitSlop={20}
                        onPress={() => navigation.goBack()}
                    >
                        <BackArrow/>
                    </Pressable>

                    <View className="flex-1 ms-[34px]">
                        <BrandBoldText className="text-[32px] text-lightPrimaryText dark:text-darkPrimaryText leading-[45px]">
                            Manage Family
                        </BrandBoldText>
                    </View>
                </View>

                <View className="items-center mb-8">
                    <BrandText className="text-lightSecondaryText dark:text-darkSecondaryText text-[16px]">
                        A maximum of 3 parents can exist per family.
                        Only the family account creator, {parents[0].name} ({parents[0].username}), can delete other parents.
                    </BrandText>
                </View>

                <Pressable
                    className="p-[10px] mb-6 rounded-full items-center justify-center bg-[#84A99D] w-full h-[56px]"
                    onPress={() => navigation.navigate('ViewFamily')}
                >
                    <BrandBoldText className="text-white text-[20px]">View family</BrandBoldText>
                </Pressable>

                <Pressable
                    className="p-[10px] mb-6 rounded-full items-center justify-center bg-[#455C56] w-full h-[56px]"
                    onPress={() => navigation.navigate('AddFamilyMember', {isParent: false})}
                >
                    <BrandBoldText className="text-white text-[20px]">Add a kid</BrandBoldText>
                </Pressable>

                {parents.length <= 2 &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px] mb-6"
                        onPress={() => navigation.navigate('AddFamilyMember', {isParent: true})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Add a parent</BrandBoldText>
                    </Pressable>
                }

                {kids.length >= 1 &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px] mb-6"
                        onPress={() => navigation.navigate('DeleteFamilyMember', {users: kids, isParent: false})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Delete a kid</BrandBoldText>
                    </Pressable>
                }

                {(parents.length >= 2 && parents[0]._id === loggedInData._id) &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#F40000] w-full h-[56px]"
                        onPress={() => navigation.navigate('DeleteFamilyMember', {users: parents, isParent: true})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Delete a parent</BrandBoldText>
                    </Pressable>
                }
            </View>

            <View className="absolute bottom-0 right-0 z-0">
                <SmallBottomRightSquiggle />
            </View>
        </View>
    )
}