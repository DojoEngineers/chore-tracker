import { Text } from 'react-native';

export const BrandBoldText = ({ className = '', ...props }) => {
    return (
        <Text allowFontScaling={false} className={`font-nunitoBold ${className}`} {...props} />
    )
}