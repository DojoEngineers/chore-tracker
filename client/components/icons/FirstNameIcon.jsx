import { useColorScheme } from 'react-native';
import DarkFirstNameIcon from '../../assets/icons/DarkFirstNameIcon';
import LightFirstNameIcon from '../../assets/icons/LightFirstNameIcon';

const aspectRatio = 14 / 13

export const FirstNameIcon = ({width = 14}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkFirstNameIcon width={width} height={width/aspectRatio} />
    }
    return <LightFirstNameIcon width={width} height={width/aspectRatio} />
}