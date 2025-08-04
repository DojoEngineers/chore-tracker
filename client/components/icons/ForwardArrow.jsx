import { useColorScheme } from 'react-native';
import DarkForwardArrow from '../../assets/icons/DarkForwardArrow';
import LightForwardArrow from '../../assets/icons/LightForwardArrow';

const aspectRatio = 11 / 20

export const ForwardArrow = ({width = 11}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkForwardArrow width={width} height={width/aspectRatio} />
    }
    return <LightForwardArrow width={width} height={width/aspectRatio} />
}