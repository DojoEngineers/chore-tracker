import { useColorScheme } from 'react-native';
import LightDarkModeIcon from '../../assets/icons/LightDarkModeIcon';
import DarkDarkModeIcon from '../../assets/icons/DarkDarkModeIcon';

const aspectRatio = 24 / 24

export const DarkModeIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkDarkModeIcon width={width} height={width/aspectRatio} />
    }
    return <LightDarkModeIcon width={width} height={width/aspectRatio} />
}