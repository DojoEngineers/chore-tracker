import { useColorScheme } from 'react-native';
import DarkApproveIcon from '../../assets/icons/DarkApproveIcon';
import LightApproveAndRejectIcon from '../../assets/icons/LightApproveAndRejectIcon';

const aspectRatio = 21 / 20

export const ApproveAndRejectIcon = ({width = 21}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkApproveIcon width={width} height={width/aspectRatio} />
    }
    return <LightApproveAndRejectIcon width={width} height={width/aspectRatio} />
}