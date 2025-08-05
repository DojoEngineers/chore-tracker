import { useColorScheme } from 'react-native';
import DarkKidsIcon from '../../assets/icons/DarkKidsIcon';
import LightKidsIcon from '../../assets/icons/LightKidsIcon';

const aspectRatio = 18 / 23

export const HighlightedKidsIcon = ({width = 18}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkKidsIcon width={width} height={width/aspectRatio} />
    }
    return <LightKidsIcon width={width} height={width/aspectRatio} />
}