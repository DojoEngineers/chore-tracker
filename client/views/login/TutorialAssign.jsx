import { useNavigation } from "@react-navigation/native"
import { Pressable, Text, View } from "react-native"

export const TutorialAssign = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>Three photos here with swipe ability?</Text>
            <Text>Assign</Text>
            <Text>Lorem ipsum lorem ipsum</Text>
            <Pressable onPress={() => navigation.navigate('TutorialTrack')}> 
                <Text>Continue</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Home')}> 
                <Text>Skip</Text>
            </Pressable>
        </View>
    )
}