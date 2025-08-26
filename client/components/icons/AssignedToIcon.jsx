import { useColorScheme } from 'react-native';
import DarkFirstNameIcon from '../../assets/icons/DarkFirstNameIcon';
import LightAssignedToIcon from '../../assets/icons/LightAssignedToIcon';

const aspectRatio = 18 / 18

export const AssignedToIcon = ({width = 18}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkFirstNameIcon width={width} height={width/aspectRatio} />
    }
    return <LightAssignedToIcon width={width} height={width/aspectRatio} />
}