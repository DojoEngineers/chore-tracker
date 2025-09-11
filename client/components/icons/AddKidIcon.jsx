import { useColorScheme } from 'react-native';
import DarkKidsIcon from '../../assets/icons/DarkKidsIcon';
import LightAddKidIcon from '../../assets/icons/LightAddKidIcon';

const aspectRatio = 17 / 21

export const AddKidIcon = ({width = 17}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkKidsIcon width={width} height={width/aspectRatio} />
    }
    return <LightAddKidIcon width={width} height={width/aspectRatio} />
}