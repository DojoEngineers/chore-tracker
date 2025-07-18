import { useNavigation } from "@react-navigation/native"
import { Pressable, Text, View } from "react-native"

export const TutorialTrack = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>Three photos here with swipe ability?</Text>
            <Text>Track</Text>
            <Text>Lorem ipsum lorem ipsum</Text>
            <Pressable onPress={() => navigation.navigate('TutorialResults')}> 
                <Text>Continue</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Home')}> 
                <Text>Skip</Text>
            </Pressable>
        </View>
    )
}