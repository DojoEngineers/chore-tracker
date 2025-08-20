import { useColorScheme } from 'react-native';
import LightCameraIcon from '../../assets/icons/LightCameraIcon';
const aspectRatio = 20 / 18

export const CameraIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    return <LightCameraIcon width={width} height={width/aspectRatio} />
}