import { useColorScheme } from 'react-native';
import LightClockIcon from '../../assets/icons/LightClockIcon';
const aspectRatio = 20 / 20

export const ClockIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    return <LightClockIcon width={width} height={width/aspectRatio} />
}