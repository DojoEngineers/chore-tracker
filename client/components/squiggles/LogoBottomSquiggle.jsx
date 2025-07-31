import { useColorScheme, Dimensions } from 'react-native';
import DarkLogoBottomSquiggle from '../../assets/squiggles/DarkLogoBottomSquiggle';
import LightLogoBottomSquiggle from '../../assets/squiggles/LightLogoBottomSquiggle';

const aspectRatio = 198 / 169;

export const LogoBottomSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkLogoBottomSquiggle width={screenWidth / 2} height={(screenWidth / 2) / aspectRatio} />
    }
    return <LightLogoBottomSquiggle width={screenWidth / 2} height={(screenWidth / 2) / aspectRatio} />

}