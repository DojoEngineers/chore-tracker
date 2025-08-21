import { useColorScheme } from 'react-native';
import DarkTodayIconSvg from '../../assets/icons/DarkTodayIconSvg';
import LightToday from '../../assets/icons/LightToday';
// light and dark are named weird because we have a bunch of old colored today-icons with the simliar names.

const aspectRatio = 23 / 24

export const TodayIcon = ({width = 23}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
            return <DarkTodayIconSvg width={width} height={width / aspectRatio} />
        }
        return <LightToday width={width} height={width / aspectRatio} />
}