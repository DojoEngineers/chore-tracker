import { useColorScheme } from 'react-native';
import DarkPasswordIcon from '../../assets/icons/DarkPasswordIcon';
import LightPasswordIcon from '../../assets/icons/LightPasswordIcon';

const aspectRatio = 14 / 17

export const PasswordIcon = ({width = 14}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkPasswordIcon width={width} height={width/aspectRatio} />
    }
    return <LightPasswordIcon width={width} height={width/aspectRatio} />
}