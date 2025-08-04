import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { SettingsButton } from "../../components/SettingsButton"
import { EditProfileIcon } from "../../components/icons/EditProfileIcon"
import { FamilySettingsIcon } from "../../components/icons/FamilySettingsIcon"
import { ChangePasswordIcon } from "../../components/icons/ChangePasswordIcon"
import { useLogin } from "../../context/UserContext"

export const Settings = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px]">
            <View className="flex-row mt-[100px] items-center ps-2 mb-4">
                <Pressable
                    onPress={() => navigation.goBack()}
                >
                    <BackArrow/>
                </Pressable>
                
                <BrandBoldText className="text-[36px] text-center text-lightPrimaryText dark:text-darkPrimaryText leading-[41px] ml-8">
                    Settings
                </BrandBoldText>
            </View>
            <SettingsButton icon={EditProfileIcon} text="Edit Profile" onPress={() => navigation.navigate("EditProfile")}/>
            <SettingsButton icon={FamilySettingsIcon} text="Family Settings" onPress={() => navigation.navigate("FamilySettings")}/>
            <SettingsButton icon={ChangePasswordIcon} text="Change Password" onPress={() => navigation.navigate("SetPassword", {username: loggedInData.username})}/>
        </View>
    )
}