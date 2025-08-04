import { useColorScheme } from 'react-native';
import DarkFamilySettingsIcon from '../../assets/icons/DarkFamilySettingsIcon';
import LightFamilySettingsIcon from '../../assets/icons/LightFamilySettingsIcon';

const aspectRatio = 24 / 19

export const FamilySettingsIcon = ({width = 24}) => {

    const colorScheme = useColorScheme()

    if (colorScheme === 'dark') {
        return <DarkFamilySettingsIcon width={width} height={width/aspectRatio} />
    }
    return <LightFamilySettingsIcon width={width} height={width/aspectRatio} />
}