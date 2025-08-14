import { Pressable, View } from 'react-native';
import { BrandBoldText } from './text/BrandBoldText';
import { BrandText } from './text/BrandText';


export const BottomLink = ({onPress, text, link}) => {

    return (
        <View className="flex-row">
            <BrandText className="text-lightPrimaryText dark:text-darkPrimaryText text-[15px]">{text}</BrandText>
            <Pressable onPress={onPress} hitSlop={20}>
                <BrandBoldText className="text-lightLink dark:text-darkLink text-[15px]">{link}</BrandBoldText>
            </Pressable>
        </View>
    )
}