import { useColorScheme } from 'react-native';
import LightClockIcon from '../../assets/icons/LightClockIcon';
import DarkClockIcon from '../../assets/icons/DarkClockIcon';
const aspectRatio = 20 / 20

export const ClockIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()
    
    if (colorScheme === 'dark') {
                return <DarkClockIcon width={width} height={width/aspectRatio} />
            }
            return <LightClockIcon width={width} height={width/aspectRatio} />
}