import { useColorScheme } from 'react-native';
import DarkApproveIcon from '../../assets/icons/DarkApproveIcon';
import LightApproveIcon from '../../assets/icons/LightApproveIcon';

const aspectRatio = 24 / 23

export const HighlightedApproveIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkApproveIcon width={width} height={width/aspectRatio} />
    }
    return <LightApproveIcon width={width} height={width/aspectRatio} />
}