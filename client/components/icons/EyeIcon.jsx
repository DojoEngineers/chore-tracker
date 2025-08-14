import { useColorScheme } from 'react-native';
import DarkEyeIcon from '../../assets/icons/DarkEyeIcon';
import LightEyeIcon from '../../assets/icons/LightEyeIcon';

const aspectRatio = 20 / 13

export const EyeIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkEyeIcon width={width} height={width/aspectRatio} />
    }
    return <LightEyeIcon width={width} height={width/aspectRatio} />
}