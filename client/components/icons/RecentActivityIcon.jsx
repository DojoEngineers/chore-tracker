import { useColorScheme } from 'react-native';
import DarkRecentActivityIcon from '../../assets/icons/DarkRecentActivityIcon';
import LightClockIcon from '../../assets/icons/LightClockIcon';

const aspectRatio = 20 / 20

export const RecentActivityIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkRecentActivityIcon width={width} height={width/aspectRatio} />
    }
    return <LightClockIcon width={width} height={width/aspectRatio} />
}