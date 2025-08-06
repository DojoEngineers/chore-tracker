import { Pressable, View } from "react-native"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { useLogin } from "../../context/UserContext"
import { BackArrow } from "../../components/icons/BackArrow"
import { useNavigation } from "@react-navigation/native"
import { BrandText } from "../../components/text/BrandText"

export const FamilySettings = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px] items-center">

            <View className="mt-[150px] w-full">

                <Pressable
                    className="mb-6 px-2"
                    onPress={() => navigation.navigate("Settings", {animationType: "slide_from_left"})}
                >
                    <BackArrow/>
                </Pressable>

                <View className="items-center mb-8">
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

                {loggedInData.family.parents.length <= 2 &&
                    <Pressable
                        className="p-[10px] rounded-full items-center justify-center bg-[#455C56] w-full h-[56px]"
                        onPress={() => navigation.navigate('AddFamilyMember', {isParent:true})}
                    >
                        <BrandBoldText className="text-white text-[20px]">Add a second parent</BrandBoldText>
                    </Pressable>
                }
            </View>
        </View>
    )
}