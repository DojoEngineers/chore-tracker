import { useColorScheme, Dimensions } from 'react-native';
import DarkLogoBottomSquiggle from '../../assets/squiggles/DarkLogoBottomSquiggle';
import LightBottomRightSquiggle from '../../assets/squiggles/LightBottomRightSquiggle';

const aspectRatio = 198 / 169;

export const SmallBottomRightSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkLogoBottomSquiggle width={screenWidth / 2} height={(screenWidth / 2) / aspectRatio} />
    }
    return <LightBottomRightSquiggle width={screenWidth / 2} height={(screenWidth / 2) / aspectRatio} />

}