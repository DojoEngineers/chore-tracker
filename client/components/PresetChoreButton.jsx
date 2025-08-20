import { Pressable } from "react-native"
import { BrandText } from "./text/BrandText"
import { useNavigation } from "@react-navigation/native"


export const PresetChoreButton = ({chore}) => {

    const navigation = useNavigation()
    
    return (
        <Pressable
            onPress={() => navigation.navigate("NewChoreDetails", {title: chore})}
            className="w-full h-[52px] my-2 dark:bg-[#444955] bg-[#DEDEDE] items-center justify-center rounded-xl"
        >
            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[16px]">
                {chore}
            </BrandText>
        </Pressable>
    )
}