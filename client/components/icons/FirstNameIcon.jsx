import { useColorScheme } from 'react-native';
import DarkFirstNameIcon from '../../assets/icons/DarkFirstNameIcon';
// import LightFirstNameIcon from '../../assets/icons/LightFirstNameIcon';
import BlackFirstName from '../../assets/icons/BlackFirstName'

const aspectRatio = 20 / 19

export const FirstNameIcon = ({ width = 20 }) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkFirstNameIcon width={width} height={width / aspectRatio} />
    }
    return <BlackFirstName width={width} height={width / aspectRatio} />
}