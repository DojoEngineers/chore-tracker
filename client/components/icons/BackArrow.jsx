import { useColorScheme } from 'react-native';
import DarkBackArrow from '../../assets/icons/DarkBackArrow';
import LightBackArrow from '../../assets/icons/LightBackArrow';

const aspectRatio = 11 / 20

export const BackArrow = ({width = 20}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkBackArrow width={width} height={width/aspectRatio} />
    }
    return <LightBackArrow width={width} height={width/aspectRatio} />
}