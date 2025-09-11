import { useColorScheme } from 'react-native';
import DarkLargeSquareIcon from '../../assets/icons/DarkLargeSquareIcon';
import LightLargeSquareIcon from '../../assets/icons/LightLargeSquareIcon';

const aspectRatio = 55 / 55

export const LargeSquareIcon = ({width = 55}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkLargeSquareIcon width={width} height={width/aspectRatio} />
    }
    return <LightLargeSquareIcon width={width} height={width/aspectRatio} />
}