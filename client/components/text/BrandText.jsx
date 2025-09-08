import { Text } from 'react-native';

export const BrandText = ({ className = '', ...props }) => {
    return (
        <Text
            // className={`font-nunito ${className}`}
            {...props} />
    )
}