import { useNavigation } from "@react-navigation/native"
import { Pressable, Text, View } from "react-native"
import { useLogin } from "../../context/UserContext"

export const TutorialResults = () => {

    const navigation = useNavigation()
    const {loggedInData} = useLogin()

    const handleSubmit = () => {
        if (loggedInData.isParent) {
            navigation.navigate('ParentDashboard')
        } else {
            navigation.navigate('KidDashboard')
        }
    }

    return (
        <View>
            <Text>Three photos here with swipe ability?</Text>
            <Text>Results</Text>
            <Text>Lorem ipsum lorem ipsum</Text>
            <Pressable onPress={handleSubmit}> 
                <Text>Continue</Text>
            </Pressable>
        </View>
    )
}