import { useColorScheme } from 'react-native';
import DarkStageIcon from '../../assets/icons/DarkStageIcon';
import LightStageIcon from '../../assets/icons/LightStageIcon';

const aspectRatio = 21 / 21

export const StageIcon = ({width = 21}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkStageIcon width={width} height={width/aspectRatio} />
    }
    return <LightStageIcon width={width} height={width/aspectRatio} />
}