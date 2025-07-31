import { useColorScheme, Dimensions } from 'react-native';
import DarkBottomSquiggle from '../../assets/squiggles/DarkBottomSquiggle';
import LightBottomSquiggle from '../../assets/squiggles/LightBottomSquiggle';

const aspectRatio = 136 / 268;

export const BottomSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkBottomSquiggle width={screenWidth / 3} height={(screenWidth / 3) / aspectRatio} />
    }
    return <LightBottomSquiggle width={screenWidth / 3} height={(screenWidth / 3) / aspectRatio} />
}