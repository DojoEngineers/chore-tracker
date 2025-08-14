import { useColorScheme } from 'react-native';
import DarkHelpIcon from '../../assets/icons/DarkHelpIcon';
import LightHelpIcon from '../../assets/icons/LightHelpIcon';

const aspectRatio = 24 / 24

export const HelpIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkHelpIcon width={width} height={width/aspectRatio} />
    }
    return <LightHelpIcon width={width} height={width/aspectRatio} />
}