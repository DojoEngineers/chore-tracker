import { Pressable } from 'react-native';
import { BrandBoldText } from './text/BrandBoldText';


export const PrimaryButton = ({onPress, label, disabled = false}) => {

    return (
            <Pressable
                onPress={!disabled ? onPress : null}
                disabled={disabled}
                className={`
                    p-[10px] rounded-full items-center justify-center bg-lightButton dark:bg-darkButton w-full h-[56px]
                    ${disabled ? 'opacity-50' : ''}
                `}
            >
                <BrandBoldText className="text-white text-[20px]">
                    {disabled ? "Loading..." : label}
                </BrandBoldText>
            </Pressable>
    )
}