import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BackArrow } from "../../components/icons/BackArrow"
import { BrandBoldText } from "../../components/text/BrandBoldText"
import { SettingsButton } from "../../components/SettingsButton"
import { EditProfileIcon } from "../../components/icons/EditProfileIcon"
import { FamilySettingsIcon } from "../../components/icons/FamilySettingsIcon"
import { ChangePasswordIcon } from "../../components/icons/ChangePasswordIcon"
import { useLogin } from "../../context/UserContext"
import { PrivacyIcon } from "../../components/icons/PrivacyIcon"
import { HelpIcon } from "../../components/icons/HelpIcon"
import { TermsIcon } from "../../components/icons/TermsIcon"
import { LogoutIcon } from "../../components/icons/LogoutIcon"
import { DeleteIcon } from "../../components/icons/DeleteIcon"
import { NotificationsIcon } from "../../components/icons/NotificationsIcon"
import { DarkModeIcon } from "../../components/icons/DarkModeIcon"
import { NotificationsSwitch } from "../../components/NotificationsSwitch"
import { ThemeDropDown } from "../../components/ThemeDropDown"

export const Settings = () => {

    const navigation = useNavigation()
    const {loggedInData, logout} = useLogin()

    const handleLogout = () => {
        logout()
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { animationType: 'slide_from_left' }}]
        })
    }

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg px-[16px] justify-between">
            <View>
                <View className="flex-row mt-[75px] items-center ps-2 mb-4">
                    <Pressable
                        hitSlop={20}
                        onPress={() => navigation.navigate(loggedInData.isParent ? "ParentDashboard" : "KidDashboard", {animationType: "fade_from_bottom"})}
                    >
                        <BackArrow/>
                    </Pressable>
                
                    <BrandBoldText className="text-[36px] text-lightPrimaryText dark:text-darkPrimaryText leading-[41px] ml-8">
                        Settings
                    </BrandBoldText>
                </View>
                <SettingsButton icon={EditProfileIcon} text="Edit Profile" onPress={() => navigation.navigate("EditProfile")}/>
                {loggedInData?.isParent &&
                    <SettingsButton icon={FamilySettingsIcon} text="Add Family Member" onPress={() => navigation.navigate("FamilySettings")}/>
                }
                <SettingsButton icon={ChangePasswordIcon} text="Change Password" onPress={() => navigation.navigate("VerifyPassword", {deleteAccount: false})}/>

                <View
                    className="flex-row items-center justify-between w-full py-5"
                >
                    <View className="flex-row items-center">
                        <NotificationsIcon />
                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-8">
                            Notifications
                        </BrandBoldText>
                    </View>

                    <NotificationsSwitch />
                </View>

                <View
                    className="flex-row items-center justify-between w-full"
                >
                    <View className="flex-row items-center">
                        <DarkModeIcon />
                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-8">
                            Theme
                        </BrandBoldText>
                    </View>

                    <ThemeDropDown/>
                </View>
                
                <SettingsButton icon={PrivacyIcon} text="Privacy" onPress={() => navigation.navigate("Privacy")}/>
                
                <SettingsButton icon={HelpIcon} text="Help & Support" onPress={() => navigation.navigate("Help")}/>
                
                <SettingsButton icon={TermsIcon} text="Terms & Policies" onPress={() => navigation.navigate("Terms")}/>
            </View>

            <View className="mb-[50px]">
                <Pressable
                    onPress={handleLogout}
                    className="p-[10px] rounded-full items-center justify-center bg-lightButton w-full h-[56px] mb-4"
                >
                    <View className="flex-1 flex-row items-center">
                        <LogoutIcon />
                        <BrandBoldText className="text-white text-[20px] ms-4">
                            Logout
                        </BrandBoldText>
                    </View>
                </Pressable>
                
                <Pressable
                    onPress={() => navigation.navigate("VerifyPassword", {deleteAccount: true})}
                    className="p-[10px] rounded-full items-center justify-center bg-[#D0D1D4] dark:bg-[#444955] w-full h-[56px]"
                >
                    <View className="flex-1 flex-row items-center">
                        <DeleteIcon />
                        <BrandBoldText className="text-[#A1A4AA] dark:text-[#737780] text-[20px] ms-4">
                            Delete Account
                        </BrandBoldText>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}