import { useColorScheme } from 'react-native';
import DarkTermsIcon from '../../assets/icons/DarkTermsIcon';
import LightTermsIcon from '../../assets/icons/LightTermsIcon';

const aspectRatio = 24 / 24

export const TermsIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkTermsIcon width={width} height={width/aspectRatio} />
    }
    return <LightTermsIcon width={width} height={width/aspectRatio} />
}