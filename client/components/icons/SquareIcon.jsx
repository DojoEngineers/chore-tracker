import { useColorScheme } from 'react-native';
import DarkSquareIcon from '../../assets/icons/DarkSquareIcon';
import LightSquareIcon from '../../assets/icons/LightSquareIcon';

const aspectRatio = 18 / 18

export const SquareIcon = ({width = 18}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkSquareIcon width={width} height={width/aspectRatio} />
    }
    return <LightSquareIcon width={width} height={width/aspectRatio} />
}