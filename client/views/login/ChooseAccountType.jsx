import { View, Text, Pressable } from "react-native"
import { useNavigation } from '@react-navigation/native'

export const ChooseAccountType = () => {

    const navigation = useNavigation()

    return (
        <View>
            <Text>Chore Tracking App</Text>
            <Pressable onPress={() => navigation.navigate('ParentRegistration')}><Text>I'm a parent.</Text></Pressable>
            <Pressable onPress={() => navigation.navigate('ChildRegistration')}><Text>I'm a kid.</Text></Pressable>
        </View>
    )

}