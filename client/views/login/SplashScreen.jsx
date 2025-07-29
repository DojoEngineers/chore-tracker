import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Text, View } from "react-native";


export const SplashScreen = () => {

    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('StartingPage')
        }, 2000)
    return () => clearTimeout(timer)
    }, [])

    return (
        <View>
            <Text>Chore Tracking App</Text>
            <Text>LOGO HERE</Text>
        </View>
    )
}