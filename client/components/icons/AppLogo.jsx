import { useColorScheme } from 'react-native';
import DarkAppLogo from '../../assets/DarkAppLogo';
import LightAppLogo from '../../assets/LightAppLogo';

const aspectRatio = 39.93 /39.93

export const AppLogo = ({width = 250}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkAppLogo width={width} height={width/aspectRatio} />
    }
    return <LightAppLogo width={width} height={width/aspectRatio} />
}