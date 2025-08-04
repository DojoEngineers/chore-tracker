import { useColorScheme } from 'react-native';
import DarkChangePasswordIcon from '../../assets/icons/DarkChangePasswordIcon';
import LightChangePasswordIcon from '../../assets/icons/LightChangePasswordIcon';

const aspectRatio = 24 / 28

export const ChangePasswordIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkChangePasswordIcon width={width} height={width/aspectRatio} />
    }
    return <LightChangePasswordIcon width={width} height={width/aspectRatio} />
}