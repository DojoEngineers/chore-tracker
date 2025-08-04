import { useColorScheme } from 'react-native';
import DarkSettingsIcon from '../../assets/icons/DarkSettingsIcon';
import LightSettingsIcon from '../../assets/icons/LightSettingsIcon';

const aspectRatio = 20 / 20

export const SettingsIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkSettingsIcon width={width} height={width/aspectRatio} />
    }
    return <LightSettingsIcon width={width} height={width/aspectRatio} />
}