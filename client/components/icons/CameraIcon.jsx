import { useColorScheme } from 'react-native';
import LightCameraIcon from '../../assets/icons/LightCameraIcon';
import DarkCameraIcon from '../../assets/icons/DarkCameraIcon';
const aspectRatio = 19 / 16

export const CameraIcon = ({ width = 19 }) => {

    const colorScheme = useColorScheme()
    
    if (colorScheme === 'dark') {
        return <DarkCameraIcon width={width} height={width / aspectRatio} />
    }
    return <LightCameraIcon width={width} height={width / aspectRatio} />
}