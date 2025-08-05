import { useColorScheme } from 'react-native';
import DarkCloseIcon from '../../assets/icons/DarkCloseIcon';
import LightCloseIcon from '../../assets/icons/LightCloseIcon';

const aspectRatio = 15 / 15

export const CloseIcon = ({width = 15}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkCloseIcon width={width} height={width/aspectRatio} />
    }
    return <LightCloseIcon width={width} height={width/aspectRatio} />
}