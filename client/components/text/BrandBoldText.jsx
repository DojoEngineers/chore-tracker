import { Text } from 'react-native';

export const BrandBoldText = ({ className = '', ...props }) => {
    return (
        <Text className={`font-nunitoBold ${className}`} {...props} />
    )
}