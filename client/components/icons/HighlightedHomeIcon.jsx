import { useColorScheme } from 'react-native';
import DarkHomeIcon from '../../assets/icons/DarkHomeIcon';
import LightHomeIcon from '../../assets/icons/LightHomeIcon';

const aspectRatio = 22 / 23

export const HighlightedHomeIcon = ({width = 22}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkHomeIcon width={width} height={width/aspectRatio} />
    }
    return <LightHomeIcon width={width} height={width/aspectRatio} />
}