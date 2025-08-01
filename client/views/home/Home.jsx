import { Pressable, Text, View } from "react-native"
import { useLogin } from "../../context/UserContext"
import { useNavigation } from "@react-navigation/native"

export const Home = () => {

    const {logout} = useLogin()
    const navigation = useNavigation()

    const handleLogout = () => {
        logout()
        navigation.replace("StartingPage")
    }

    return (
        <View className="m-20">
            <Text>Home Page</Text>
            <Pressable onPress={handleLogout}>
                <Text>Logout</Text>
            </Pressable>
        </View>
    )
}