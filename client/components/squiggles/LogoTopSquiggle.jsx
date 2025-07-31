import { useColorScheme, Dimensions } from 'react-native';
import DarkLogoTopSquiggle from '../../assets/squiggles/DarkLogoTopSquiggle';
import LightLogoTopSquiggle from '../../assets/squiggles/LightLogoTopSquiggle';

const aspectRatio = 360 / 119;

export const LogoTopSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkLogoTopSquiggle width={screenWidth} height={screenWidth / aspectRatio} />
    }
    return <LightLogoTopSquiggle width={screenWidth} height={screenWidth / aspectRatio} />
}