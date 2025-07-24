import { useNavigation } from "@react-navigation/native"
import { View, Text, Pressable } from "react-native"

export const StartingPage = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>Chore Tracking App</Text>
            <Pressable onPress={() => navigation.navigate('Login')}><Text>Login</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('ChooseAccountType')}><Text>Register</Text></Pressable>
        </View>
    )
}