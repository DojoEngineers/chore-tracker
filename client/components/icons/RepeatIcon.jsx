import { useColorScheme } from 'react-native';
import LightRepeatIcon from '../../assets/icons/LightRepeatIcon';
import DarkRepeatIcon from '../../assets/icons/DarkRepeatIcon'
const aspectRatio = 19 / 17

export const RepeatIcon = ({width = 19}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
            return <DarkRepeatIcon width={width} height={width/aspectRatio} />
        }
        return <LightRepeatIcon width={width} height={width/aspectRatio} />
}