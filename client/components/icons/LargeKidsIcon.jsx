import { useColorScheme } from 'react-native';
import DarkLargeKidsIcon from '../../assets/icons/DarkLargeKidsIcon';
import LightLargeKidsIcon from '../../assets/icons/LightLargeKidsIcon';

const aspectRatio = 44 / 55

export const LargeKidsIcon = ({width = 44}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkLargeKidsIcon width={width} height={width/aspectRatio} />
    }
    return <LightLargeKidsIcon width={width} height={width/aspectRatio} />
}