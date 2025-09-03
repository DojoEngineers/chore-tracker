import { useColorScheme } from 'react-native';
import DarkKidArrow from '../../assets/icons/DarkKidArrow';
import LightKidArrow from '../../assets/icons/LightKidArrow';

const aspectRatio = 31 / 102

export const KidArrow = ({width = 31}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkKidArrow width={width} height={width/aspectRatio} />
    }
    return <LightKidArrow width={width} height={width/aspectRatio} />
}