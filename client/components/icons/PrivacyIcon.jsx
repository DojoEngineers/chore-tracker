import { useColorScheme } from 'react-native';
import DarkPrivacyIcon from '../../assets/icons/DarkPrivacyIcon';
import LightPrivacyIcon from '../../assets/icons/LightPrivacyIcon';

const aspectRatio = 24 / 27

export const PrivacyIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkPrivacyIcon width={width} height={width/aspectRatio} />
    }
    return <LightPrivacyIcon width={width} height={width/aspectRatio} />
}