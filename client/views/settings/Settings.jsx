import { useNavigation } from "@react-navigation/native"
import { Pressable, useColorScheme, View } from "react-native"
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
import { Switch } from "react-native-paper"
import { useState } from "react"
import DropDownPicker from "react-native-dropdown-picker"
import { MaterialIcons } from '@expo/vector-icons'

export const Settings = () => {

    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([
        { label: 'Auto', value: 'a' },
        { label: 'Light', value: 'l' },
        { label: 'Dark', value: 'd' },
    ])

    const navigation = useNavigation()
    const {loggedInData, logout, notifications, toggleNotifications, theme, setAppTheme} = useLogin()
    const colorScheme = useColorScheme()

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
                        onPress={() => navigation.navigate(loggedInData.isParent ? "ParentDashboard" : "KidDashboard", {animationType: "slide_from_left"})}
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
                <SettingsButton icon={ChangePasswordIcon} text="Change Password" onPress={() => navigation.navigate("VerifyPassword", {changePassword: true})}/>

                <View
                    className="flex-row items-center justify-between w-full py-5"
                >
                    <View className="flex-row items-center">
                        <NotificationsIcon />
                        <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-8">
                            Notifications
                        </BrandBoldText>
                    </View>

                    <Switch
                        value={notifications}
                        onValueChange={toggleNotifications}
                        color="#FB943C"
                        style={{ transform: [{ scale: 1 }] }}
                    />
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

                    <DropDownPicker
                        open={open}
                        value={theme}
                        placeholder=''
                        items={items}
                        setOpen={setOpen}
                        setValue={callback => {
                            const newValue = callback(theme)
                            setAppTheme(newValue)
                        }}
                        setItems={setItems}
                        containerStyle={{ width: 90 }}
                        style={{
                            backgroundColor: colorScheme === 'dark' ? '#22252B' : '#F5F8F6',
                            borderColor: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                        labelStyle={{
                            fontFamily: 'Nunito',
                            fontSize: 14,
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                        listItemLabelStyle={{
                            fontFamily: 'Nunito',
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                            fontSize: 14,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: colorScheme === 'dark' ? '#22252B' : '#F5F8F6',
                            borderColor: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                        ArrowDownIconComponent={() => (
                            <MaterialIcons
                                name="keyboard-arrow-down"
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        )}
                        ArrowUpIconComponent={() => (
                            <MaterialIcons
                                name="keyboard-arrow-up"
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        )}
                        TickIconComponent={() => (
                            <MaterialIcons
                                name="check"
                                size={18}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        )}
                    />
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
                    className="p-[10px] rounded-full items-center justify-center bg-[#444955] w-full h-[56px]"
                >
                    <View className="flex-1 flex-row items-center">
                        <DeleteIcon />
                        <BrandBoldText className="text-[#737780] text-[20px] ms-4">
                            Delete Account
                        </BrandBoldText>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}