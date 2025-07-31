import { useColorScheme, Dimensions } from 'react-native';
import DarkTopSquiggle from '../../assets/squiggles/DarkTopSquiggle';
import LightTopSquiggle from '../../assets/squiggles/LightTopSquiggle';

const aspectRatio = 360 / 119;

export const TopSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkTopSquiggle width={screenWidth} height={screenWidth / aspectRatio} />
    }
    return <LightTopSquiggle width={screenWidth} height={screenWidth / aspectRatio} />
}