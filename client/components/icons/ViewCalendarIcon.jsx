import { useColorScheme } from 'react-native';
import LightDateIcon from '../../assets/icons/LightDateIcon';
import DarkTodayIcon from '../../assets/icons/DarkTodayIcon';

const aspectRatio = 18 / 18

export const ViewCalendarIcon = ({ width = 18 }) => {
    
    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkTodayIcon width={width} height={width / aspectRatio} />
    }
    return <LightDateIcon width={width} height={width / aspectRatio} />
}