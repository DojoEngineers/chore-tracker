import { Pressable, Text, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"
import { ParentNavBar } from "../../components/ParentNavBar"

export const ParentDashboard = () => {

    const {loggedInData} = useLogin()
    const navigation = useNavigation()


    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg justify-between">
            <Header />
            <ParentNavBar />
        </View>
    )
}