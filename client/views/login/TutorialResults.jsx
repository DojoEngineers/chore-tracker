import { useNavigation } from "@react-navigation/native"
import { Pressable, Text, View } from "react-native"

export const TutorialResults = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>Three photos here with swipe ability?</Text>
            <Text>Results</Text>
            <Text>Lorem ipsum lorem ipsum</Text>
            <Pressable onPress={() => navigation.navigate('Home')}> 
                <Text>Continue</Text>
            </Pressable>
        </View>
    )
}