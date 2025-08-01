import { useColorScheme } from 'react-native';
import DarkEmailIcon from '../../assets/icons/DarkEmailIcon';
import LightEmailIcon from '../../assets/icons/LightEmailIcon';

const aspectRatio = 14 / 11

export const EmailIcon = ({width = 14}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkEmailIcon width={width} height={width/aspectRatio} />
    }
    return <LightEmailIcon width={width} height={width/aspectRatio} />
}