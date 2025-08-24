import { useColorScheme } from 'react-native';
import DarkDateIcon from '../../assets/icons/DarkDateIcon';
import LightDateIcon from '../../assets/icons/LightDateIcon';

const aspectRatio = 18 / 20

export const DateIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkDateIcon width={width} height={width/aspectRatio} />
    }
    return <LightDateIcon width={width} height={width/aspectRatio} />
}