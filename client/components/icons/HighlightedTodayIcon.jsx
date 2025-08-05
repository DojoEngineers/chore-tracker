import { useColorScheme } from 'react-native';
import DarkTodayIcon from '../../assets/icons/DarkTodayIcon';
import LightTodayIcon from '../../assets/icons/LightTodayIcon';

const aspectRatio = 22 / 24

export const HighlightedTodayIcon = ({width = 22}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkTodayIcon width={width} height={width/aspectRatio} />
    }
    return <LightTodayIcon width={width} height={width/aspectRatio} />
}