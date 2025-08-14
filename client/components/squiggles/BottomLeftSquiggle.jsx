import { useColorScheme, Dimensions } from 'react-native';
import DarkBottomLeftSquiggle from '../../assets/squiggles/DarkBottomLeftSquiggle';
import LightBottomLeftSquiggle from '../../assets/squiggles/LightBottomLeftSquiggle';

const aspectRatio = 125 / 227;

export const BottomLeftSquiggle = () => {

    const colorScheme = useColorScheme()
    const screenWidth = Dimensions.get('window').width

    if (colorScheme === 'dark') {
        return <DarkBottomLeftSquiggle width={screenWidth / 3} height={(screenWidth / 3) / aspectRatio} />
    }
    return <LightBottomLeftSquiggle width={screenWidth / 3} height={(screenWidth / 3) / aspectRatio} />
}