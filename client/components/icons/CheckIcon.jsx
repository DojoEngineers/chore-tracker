import { useColorScheme } from 'react-native';
import LightCheckIcon from '../../assets/icons/LightCheckIcon';
import DarkCheckIcon from '../../assets/icons/DarkCheckIcon';
const aspectRatio = 20 / 20

export const CheckIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()
    
    if (colorScheme === 'dark') {
                return <DarkCheckIcon width={width} height={width/aspectRatio} />
            }
            return <LightCheckIcon width={width} height={width/aspectRatio} />
}