import { useColorScheme } from 'react-native';
import LightWriteIcon from '../../assets/icons/LightWriteIcon';
import DarkWriteIcon from '../../assets/icons/DarkWriteIcon';

const aspectRatio = 18 / 18

export const WriteIcon = ({ width = 18 }) => {
    
    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkWriteIcon width={width} height={width / aspectRatio} />
    }
    return <LightWriteIcon width={width} height={width / aspectRatio} />
}