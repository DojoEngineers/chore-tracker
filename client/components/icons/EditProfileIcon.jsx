import { useColorScheme } from 'react-native';
import DarkEditProfileIcon from '../../assets/icons/DarkEditProfileIcon';
import LightEditProfileIcon from '../../assets/icons/LightEditProfileIcon';

const aspectRatio = 24 / 24

export const EditProfileIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkEditProfileIcon width={width} height={width/aspectRatio} />
    }
    return <LightEditProfileIcon width={width} height={width/aspectRatio} />
}