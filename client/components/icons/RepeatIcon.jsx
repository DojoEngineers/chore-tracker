import { useColorScheme } from 'react-native';
import LightRepeatIcon from '../../assets/icons/LightRepeatIcon';
const aspectRatio = 20 / 18

export const RepeatIcon = ({width = 20}) => {

    const colorScheme = useColorScheme()

    return <LightRepeatIcon width={width} height={width/aspectRatio} />
}