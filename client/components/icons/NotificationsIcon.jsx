import { useColorScheme } from 'react-native';
import DarkNotificationsIcon from '../../assets/icons/DarkNotificationsIcon';
import LightNotificationsIcon from '../../assets/icons/LightNotificationsIcon';

const aspectRatio = 24 / 27

export const NotificationsIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkNotificationsIcon width={width} height={width/aspectRatio} />
    }
    return <LightNotificationsIcon width={width} height={width/aspectRatio} />
}