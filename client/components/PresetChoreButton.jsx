import { Pressable } from "react-native"
import { BrandText } from "./text/BrandText"
import { useNavigation } from "@react-navigation/native"


export const PresetChoreButton = ({chore}) => {

    const navigation = useNavigation()
    
    return (
        <Pressable
            onPress={() => navigation.navigate("NewChoreDetails", {title: chore})}
            className="w-full h-[52px] my-2 dark:bg-[#444955] bg-[#57756B] items-center justify-center rounded-3xl"
        >
            <BrandText className="text-darkPrimaryText text-[16px]">
                {chore}
            </BrandText>
        </Pressable>
    )
}