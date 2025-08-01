import { Pressable } from 'react-native';
import { BrandBoldText } from './text/BrandBoldText';


export const PrimaryButton = ({onPress, label}) => {

    return (
            <Pressable
                onPress={onPress}
                className="p-[10px] rounded-full items-center justify-center bg-lightButton dark:bg-darkButton w-full h-[56px]"
            >
                <BrandBoldText className="text-white text-[20px]">
                    {label}
                </BrandBoldText>
            </Pressable>
    )
}