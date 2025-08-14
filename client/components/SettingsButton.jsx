import { useNavigation } from "@react-navigation/native"
import { Pressable, View } from "react-native"
import { BrandBoldText } from "./text/BrandBoldText"
import { ForwardArrow } from "./icons/ForwardArrow"


export const SettingsButton = ({icon:Icon, text, onPress}) => {

    const navigation = useNavigation()

    return (
            <Pressable
                onPress={onPress}
                className="flex-row items-center justify-between w-full py-5"
            >
                <View className="flex-1 flex-row items-center">
                    {Icon && <Icon />}
                    <BrandBoldText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px] ps-8">
                        {text}
                    </BrandBoldText>
                </View>
                <ForwardArrow width={8}/>
            </Pressable>
    )
}