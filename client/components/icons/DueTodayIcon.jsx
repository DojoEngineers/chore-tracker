import { useColorScheme } from 'react-native';
import LightDueTodayIcon from '../../assets/icons/LightDueTodayIcon';
import DarkTodayIcon from '../../assets/icons/DarkTodayIcon';
const aspectRatio = 18 / 20

export const DueTodayIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()
    
    if (colorScheme === 'dark') {
                return <DarkTodayIcon width={width} height={width/aspectRatio} />
            }
            return <LightDueTodayIcon width={width} height={width/aspectRatio} />
}