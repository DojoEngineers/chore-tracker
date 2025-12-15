import { Text } from 'react-native';

export const BrandText = ({ className = '', ...props }) => {
    return (
        <Text allowFontScaling={false} className={`font-nunito ${className}`} {...props} />
    )
}