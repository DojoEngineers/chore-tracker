import { Pressable, Text, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"
import { Header } from "../../components/Header"

export const ParentDashboard = () => {

    const {logout} = useLogin()
    const navigation = useNavigation()

    const handleLogout = () => {
        logout()
        navigation.reset({
            index: 0,
            routes: [{ name: 'StartingPage'}]
        })
    }

    return (
        <View className="flex-1 bg-lightBg dark:bg-darkBg">
            <Header />
            <Pressable onPress={handleLogout}>
                <Text>Logout</Text>
            </Pressable>
        </View>
    )
}