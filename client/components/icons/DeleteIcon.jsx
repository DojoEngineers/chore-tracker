import { useColorScheme } from 'react-native';
import DarkDeleteIcon from '../../assets/icons/DarkDeleteIcon';
import LightDeleteIcon from '../../assets/icons/LightDeleteIcon';

const aspectRatio = 25 / 26

export const DeleteIcon = ({width = 25}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkDeleteIcon width={width} height={width/aspectRatio} />
    }
    return <LightDeleteIcon width={width} height={width/aspectRatio} />
}